const express = require('express');

const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authController = require('../controllers/auth.controller');
const isAuth = authMiddleware.isAuth;

router.post('/grade/new', isAuth, userController.createGrade); // Admin
router.post('/subject/new', isAuth, userController.createSubject); // Admin
router.get('/grade', isAuth, userController.getGrades);
router.get('/subject', isAuth, userController.getSubjects);

router.get('/course/all', isAuth, userController.getAllCourses);
router.get('/course', isAuth, userController.getCourses);
router.post('/course/new', isAuth, userController.createCourse);
router.post('/course/register', isAuth, userController.registerCourse);
router.get('/course/tutor/registerRequests', isAuth, userController.getAllRegisterCourseRequests);
router.get('/course/student/registerRequests', isAuth, userController.getRegisterRequestsOfStudent);

router.delete('/course/registerRequests/:registerRequset_id', isAuth, userController.removeRegisterCourseRequest);
router.get('/course/:course_id', isAuth, userController.getCourseById);

router.put('/addToCourse', isAuth, userController.addStudentToCourse);

router.post('/schedule/new', isAuth, userController.createSchedule);
router.get('/create-admin', userController.createAdmin);

// Admin
router.get('/tutor/all', isAuth, userController.getAllTutors);
router.delete('/tutor/:id', isAuth, userController.deleteTutorById);

router.get('/student/all', isAuth, userController.getAllStudents);
router.delete('/tutor/:id', isAuth, userController.deleteStudentById);

//end admin

router.put("/:id/password", isAuth, userController.updatePassword);
router.put("/:id", isAuth, userController.updateUser);
router.get("/:id", isAuth, userController.getUser);
router.post("/:id/schedule/new", isAuth, userController.createSchedule);

module.exports = router;