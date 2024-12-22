const axios = require('axios');
const bcrypt = require('bcrypt');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');
const { createAuthResponse } = require('../middlewares/local.service');

let failedAttempts = {};

const teacherRegister = async (req, res) => {
    const { name, email, password, role, school, teachSubject, teachSclass } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const teacher = new Teacher({ name, email, password: hashedPass, role, school, teachSubject, teachSclass });

        const existingTeacherByEmail = await Teacher.findOne({ email });

        if (existingTeacherByEmail) {
            res.send({ message: 'Email already exists' });
        }
        else {
            let result = await teacher.save();
            await Subject.findByIdAndUpdate(teachSubject, { teacher: teacher._id });
            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const teacherLogIn = async (req, res) => {
    const { email, password, recaptchaToken } = req.body;

    // Validar campos requeridos
    if (!email || !password || !recaptchaToken) {
        return res.status(400).send({ message: 'Todos los campos son obligatorios, incluyendo el token de reCAPTCHA.' });
    }

    if (failedAttempts[email]) {
        const { isLocked, lockUntil } = failedAttempts[email];

        if (isLocked) {
            if (Date.now() >= lockUntil) {
                // Tiempo de bloqueo expirado, restablecer estado
                delete failedAttempts[email];
            } else {
                const timeLeft = (lockUntil - Date.now()) / 1000;
                return res.status(403).json({ message: `Cuenta bloqueada. Intenta de nuevo en ${Math.ceil(timeLeft)} segundos.` });
            }
        }
    }

     // Validar si la cuenta está bloqueada
     if (failedAttempts[email] && failedAttempts[email].isLocked) {
        const timeLeft = (failedAttempts[email].lockUntil - Date.now()) / 1000;
        return res.status(403).json({ message: `Cuenta bloqueada. Intenta de nuevo en ${Math.ceil(timeLeft)} segundos.` });
    }

    // Validar el token de reCAPTCHA con Google
    try {
        const recaptchaResponse = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            null,
            {
                params: {
                    secret: process.env.SECRET_KEY,
                    response: recaptchaToken,
                },
            }
        );

        const { success, score } = recaptchaResponse.data;

        // Comprobar si la validación de reCAPTCHA fue exitosa
        if (!success || score < 0.5) {
            return res.status(400).json({ message: 'reCAPTCHA no válido. Por favor, inténtalo de nuevo.' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al validar el token de reCAPTCHA.', error: error.message });
    }

    try {
        let teacher = await Teacher.findOne({ email });

        if (!teacher) {
            return res.status(404).send({ message: 'Teacher not found' });
        }

        const validated = await bcrypt.compare(password, teacher.password);
        if (!validated) {
            failedAttempts[email] = failedAttempts[email] || { count: 0, lockUntil: 0 };
            failedAttempts[email].count++;

            if (failedAttempts[email].count >= 3) {
                failedAttempts[email].isLocked = true;
                failedAttempts[email].lockUntil = Date.now() + 10 * 60 * 1000;
            }
            return res.status(401).send({ message: 'Invalid password' });
        }

        teacher = await teacher.populate("teachSubject", "subName sessions");
        teacher = await teacher.populate("school", "schoolName");
        teacher = await teacher.populate("teachSclass", "sclassName");

        // Restablecer intentos fallidos en caso de éxito
        if (failedAttempts[email]) {
            delete failedAttempts[email];
        }

        const response = createAuthResponse(teacher, {
            schoolName: teacher.school?.schoolName,
            subject: teacher.teachSubject?.subName,
            className: teacher.teachSclass?.sclassName,
        });

        res.send({response, user: teacher});
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err });
    }
};

const getTeachers = async (req, res) => {
    try {
        let teachers = await Teacher.find({ school: req.params.id })
            .populate("teachSubject", "subName")
            .populate("teachSclass", "sclassName");
        if (teachers.length > 0) {
            let modifiedTeachers = teachers.map((teacher) => {
                return { ...teacher._doc, password: undefined };
            });
            res.send(modifiedTeachers);
        } else {
            res.send({ message: "No teachers found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeacherDetail = async (req, res) => {
    try {
        let teacher = await Teacher.findById(req.params.id)
            .populate("teachSubject", "subName sessions")
            .populate("school", "schoolName")
            .populate("teachSclass", "sclassName")
        if (teacher) {
            teacher.password = undefined;
            res.send(teacher);
        }
        else {
            res.send({ message: "No teacher found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateTeacherSubject = async (req, res) => {
    const { teacherId, teachSubject } = req.body;
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            teacherId,
            { teachSubject },
            { new: true }
        );

        await Subject.findByIdAndUpdate(teachSubject, { teacher: updatedTeacher._id });

        res.send(updatedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

        await Subject.updateOne(
            { teacher: deletedTeacher._id, teacher: { $exists: true } },
            { $unset: { teacher: 1 } }
        );

        res.send(deletedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachers = async (req, res) => {
    try {
        const deletionResult = await Teacher.deleteMany({ school: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "No teachers found to delete" });
            return;
        }

        const deletedTeachers = await Teacher.find({ school: req.params.id });

        await Subject.updateMany(
            { teacher: { $in: deletedTeachers.map(teacher => teacher._id) }, teacher: { $exists: true } },
            { $unset: { teacher: "" }, $unset: { teacher: null } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachersByClass = async (req, res) => {
    try {
        const deletionResult = await Teacher.deleteMany({ sclassName: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "No teachers found to delete" });
            return;
        }

        const deletedTeachers = await Teacher.find({ sclassName: req.params.id });

        await Subject.updateMany(
            { teacher: { $in: deletedTeachers.map(teacher => teacher._id) }, teacher: { $exists: true } },
            { $unset: { teacher: "" }, $unset: { teacher: null } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const teacherAttendance = async (req, res) => {
    const { status, date } = req.body;

    try {
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.send({ message: 'Teacher not found' });
        }

        const existingAttendance = teacher.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString()
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            teacher.attendance.push({ date, status });
        }

        const result = await teacher.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error)
    }
};

module.exports = {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    getTeacherDetail,
    updateTeacherSubject,
    deleteTeacher,
    deleteTeachers,
    deleteTeachersByClass,
    teacherAttendance
};
