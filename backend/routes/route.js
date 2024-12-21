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

router.delete("/Students/:id",hasRole(['Admin']), deleteStudents)
router.delete("/StudentsClass/:id", hasRole(['Admin']),  deleteStudentsByClass)
router.delete("/Student/:id",  hasRole(['Admin']), deleteStudent)

router.put("/Student/:id", hasRole(['Admin', 'Teacher']), updateStudent)

router.put('/UpdateExamResult/:id', hasRole(['Admin', 'Teacher']), updateExamResult);
router.put('/StudentAttendance/:id', hasRole(['Teacher']), studentAttendance);
router.put('/RemoveAllStudentsSubAtten/:id', hasRole(['Admin']), clearAllStudentsAttendanceBySubject);
router.put('/RemoveAllStudentsAtten/:id', hasRole(['Admin']), clearAllStudentsAttendance);
router.put('/RemoveStudentSubAtten/:id', hasRole(['Admin']), removeStudentAttendanceBySubject);
router.put('/RemoveStudentAtten/:id', hasRole(['Admin']), removeStudentAttendance);

// Teacher
router.post('/TeacherReg', teacherRegister);
router.post('/TeacherLogin', teacherLogIn);
router.get('/Teachers/:id', isAuthenticated(), getTeachers);
router.get('/Teacher/:id', isAuthenticated(), getTeacherDetail);
router.delete('/Teachers/:id', hasRole(['Admin']), deleteTeachers);
router.delete('/TeachersClass/:id', hasRole(['Admin']), deleteTeachersByClass);
router.delete('/Teacher/:id', hasRole(['Admin']), deleteTeacher);
router.put('/TeacherSubject', hasRole(['Admin']), updateTeacherSubject);
router.post('/TeacherAttendance/:id', hasRole(['Teacher']), teacherAttendance);

// Notice
router.post('/NoticeCreate', hasRole(['Admin']), noticeCreate);
router.get('/NoticeList/:id', isAuthenticated(), noticeList);
router.delete('/Notices/:id', hasRole(['Admin']), deleteNotices);
router.delete('/Notice/:id', hasRole(['Admin']), deleteNotice);
router.put('/Notice/:id', hasRole(['Admin']), updateNotice);

// Complain
router.post('/ComplainCreate', isAuthenticated(), complainCreate);
router.get('/ComplainList/:id', isAuthenticated(), complainList);

// Sclass
router.post('/SclassCreate', hasRole(['Admin']), sclassCreate);
router.get('/SclassList/:id', isAuthenticated(), sclassList);
router.get('/Sclass/:id', isAuthenticated(), getSclassDetail);
router.get('/Sclass/Students/:id', isAuthenticated(), getSclassStudents);
router.delete('/Sclasses/:id', hasRole(['Admin']), deleteSclasses);
router.delete('/Sclass/:id', hasRole(['Admin']), deleteSclass);

// Subject
router.post('/SubjectCreate', hasRole(['Admin']), subjectCreate);
router.get('/AllSubjects/:id', isAuthenticated(), allSubjects);
router.get('/ClassSubjects/:id', isAuthenticated(), classSubjects);
router.get('/FreeSubjectList/:id', isAuthenticated(), freeSubjectList);
router.get('/Subject/:id', isAuthenticated(), getSubjectDetail);
router.delete('/Subject/:id', hasRole(['Admin']), deleteSubject);
router.delete('/Subjects/:id', hasRole(['Admin']), deleteSubjects);
router.delete('/SubjectsClass/:id', hasRole(['Admin']), deleteSubjectsByClass);

module.exports = router;
