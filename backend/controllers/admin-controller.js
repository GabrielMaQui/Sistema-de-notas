const bcrypt = require('bcrypt');
const Admin = require('../models/adminSchema.js');
const { createAuthResponse } = require('../middlewares/local.service');
const axios = require('axios');

let failedAttempts = {};

const adminRegister = async (req, res) => {

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const admin = new Admin({
            ...req.body,
            password: hashedPass
        });

        const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
        const existingSchool = await Admin.findOne({ schoolName: req.body.schoolName });

        if (existingAdminByEmail) {
            res.send({ message: 'Email already exists' });
        }
        else if (existingSchool) {
            res.send({ message: 'School name already exists' });
        }
        else {
            let result = await admin.save();
            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const adminLogIn = async (req, res) => {
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


        if (!success || score < 0.5) {
            return res.status(400).json({ message: 'reCAPTCHA no válido. Por favor, inténtalo de nuevo.' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al validar el token de reCAPTCHA.', error: error.message });
    }

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).send({ message: 'Admin not found' });
        }

        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
            failedAttempts[email] = failedAttempts[email] || { count: 0, lockUntil: 0 };
            failedAttempts[email].count++;

            if (failedAttempts[email].count >= 3) {
                failedAttempts[email].isLocked = true;
                failedAttempts[email].lockUntil = Date.now() + 10 * 60 * 1000; // Bloquear por 10 minutos
            }
            return res.status(401).send({ message: 'Invalid password' });
        }

        // Restablecer intentos fallidos en caso de éxito
        if (failedAttempts[email]) {
            delete failedAttempts[email];
        }

        const response = createAuthResponse(admin, { schoolName: admin.schoolName });
        res.send({response, user: admin});
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err });
    }
};

const getAdminDetail = async (req, res) => {
    try {
        let admin = await Admin.findById(req.params.id);
        if (admin) {
            admin.password = undefined;
            res.send(admin);
        }
        else {
            res.send({ message: "No admin found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// const deleteAdmin = async (req, res) => {
//     try {
//         const result = await Admin.findByIdAndDelete(req.params.id)

//         await Sclass.deleteMany({ school: req.params.id });
//         await Student.deleteMany({ school: req.params.id });
//         await Teacher.deleteMany({ school: req.params.id });
//         await Subject.deleteMany({ school: req.params.id });
//         await Notice.deleteMany({ school: req.params.id });
//         await Complain.deleteMany({ school: req.params.id });

//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// const updateAdmin = async (req, res) => {
//     try {
//         if (req.body.password) {
//             const salt = await bcrypt.genSalt(10)
//             res.body.password = await bcrypt.hash(res.body.password, salt)
//         }
//         let result = await Admin.findByIdAndUpdate(req.params.id,
//             { $set: req.body },
//             { new: true })

//         result.password = undefined;
//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// module.exports = { adminRegister, adminLogIn, getAdminDetail, deleteAdmin, updateAdmin };

module.exports = { adminRegister, adminLogIn, getAdminDetail };
