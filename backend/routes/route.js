const router = require('express').Router();

// const { adminRegister, adminLogIn, deleteAdmin, getAdminDetail, updateAdmin } = require('../controllers/admin-controller.js');
const { isAuthenticated, hasRole } = require('../middlewares/auth.middleware');
const { adminRegister, adminLogIn, getAdminDetail} = require('../controllers/admin-controller.js');

const { sclassCreate, sclassList, deleteSclass, deleteSclasses, getSclassDetail, getSclassStudents } = require('../controllers/class-controller.js');
const { complainCreate, complainList } = require('../controllers/complain-controller.js');
const { noticeCreate, noticeList, deleteNotices, deleteNotice, updateNotice } = require('../controllers/notice-controller.js');
const {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,
    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance } = require('../controllers/student_controller.js');
const { subjectCreate, classSubjects, deleteSubjectsByClass, getSubjectDetail, deleteSubject, freeSubjectList, allSubjects, deleteSubjects } = require('../controllers/subject-controller.js');
const { teacherRegister, teacherLogIn, getTeachers, getTeacherDetail, deleteTeachers, deleteTeachersByClass, deleteTeacher, updateTeacherSubject, teacherAttendance } = require('../controllers/teacher-controller.js');

// Admin
router.post('/AdminReg', adminRegister);
router.post('/AdminLogin', adminLogIn);

router.get('/Admin/:id', isAuthenticated(), getAdminDetail);
// router.delete("/Admin/:id", deleteAdmin)

// router.put("/Admin/:id", updateAdmin)

// Student

router.post('/StudentReg', studentRegister);
router.post('/StudentLogin', studentLogIn)

router.get("/Students/:id",  isAuthenticated(), getStudents)
router.get("/Student/:id", isAuthenticated(), getStudentDetail)

router.delete("/Students/:id",hasRole(['admin']), deleteStudents)
router.delete("/StudentsClass/:id", hasRole(['admin']),  deleteStudentsByClass)
router.delete("/Student/:id",  hasRole(['admin']), deleteStudent)

router.put("/Student/:id", hasRole(['admin', 'teacher']), updateStudent)

router.put('/UpdateExamResult/:id', hasRole(['admin', 'teacher']), updateExamResult);
router.put('/StudentAttendance/:id', hasRole(['teacher']), studentAttendance);
router.put('/RemoveAllStudentsSubAtten/:id', hasRole(['admin']), clearAllStudentsAttendanceBySubject);
router.put('/RemoveAllStudentsAtten/:id', hasRole(['admin']), clearAllStudentsAttendance);
router.put('/RemoveStudentSubAtten/:id', hasRole(['admin']), removeStudentAttendanceBySubject);
router.put('/RemoveStudentAtten/:id', hasRole(['admin']), removeStudentAttendance);

// Teacher
router.post('/TeacherReg', teacherRegister);
router.post('/TeacherLogin', teacherLogIn);
router.get('/Teachers/:id', isAuthenticated(), getTeachers);
router.get('/Teacher/:id', isAuthenticated(), getTeacherDetail);
router.delete('/Teachers/:id', hasRole(['admin']), deleteTeachers);
router.delete('/TeachersClass/:id', hasRole(['admin']), deleteTeachersByClass);
router.delete('/Teacher/:id', hasRole(['admin']), deleteTeacher);
router.put('/TeacherSubject', hasRole(['admin']), updateTeacherSubject);
router.post('/TeacherAttendance/:id', hasRole(['teacher']), teacherAttendance);

// Notice
router.post('/NoticeCreate', hasRole(['admin']), noticeCreate);
router.get('/NoticeList/:id', isAuthenticated(), noticeList);
router.delete('/Notices/:id', hasRole(['admin']), deleteNotices);
router.delete('/Notice/:id', hasRole(['admin']), deleteNotice);
router.put('/Notice/:id', hasRole(['admin']), updateNotice);

// Complain
router.post('/ComplainCreate', isAuthenticated(), complainCreate);
router.get('/ComplainList/:id', isAuthenticated(), complainList);

// Sclass
router.post('/SclassCreate', hasRole(['admin']), sclassCreate);
router.get('/SclassList/:id', isAuthenticated(), sclassList);
router.get('/Sclass/:id', isAuthenticated(), getSclassDetail);
router.get('/Sclass/Students/:id', isAuthenticated(), getSclassStudents);
router.delete('/Sclasses/:id', hasRole(['admin']), deleteSclasses);
router.delete('/Sclass/:id', hasRole(['admin']), deleteSclass);

// Subject
router.post('/SubjectCreate', hasRole(['admin']), subjectCreate);
router.get('/AllSubjects/:id', isAuthenticated(), allSubjects);
router.get('/ClassSubjects/:id', isAuthenticated(), classSubjects);
router.get('/FreeSubjectList/:id', isAuthenticated(), freeSubjectList);
router.get('/Subject/:id', isAuthenticated(), getSubjectDetail);
router.delete('/Subject/:id', hasRole(['admin']), deleteSubject);
router.delete('/Subjects/:id', hasRole(['admin']), deleteSubjects);
router.delete('/SubjectsClass/:id', hasRole(['admin']), deleteSubjectsByClass);

module.exports = router;
