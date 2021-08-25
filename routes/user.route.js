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

router.post('/course/register', isAuth, userController.registerCourse); // đăng ký hoc
router.get('/course/tutor/registerRequests', isAuth, userController.getAllRegisterCourseRequests); // danh sách đăng ký học dành cho gia sư
router.get('/course/student/registerRequests', isAuth, userController.getRegisterRequestsOfStudent); // danh sách đăng ký học dành cho học sinh
router.delete('/course/registerRequests/:registerRequset_id', isAuth, userController.removeRegisterCourseRequest); // hủy đăng ký học

router.get('/course/:course_id', isAuth, userController.getCourseById);

router.put('/addToCourse', isAuth, userController.addStudentToCourse);

router.post('/schedule/new', isAuth, userController.createSchedule);
router.get('/create-admin', userController.createAdmin);

router.get('/info/:id', isAuth, userController.getUserById);

router.get('/tutor/all', isAuth, userController.getAllTutors);
router.delete('/tutor/:id', isAuth, userController.deleteTutorById);

router.get('/student/all', isAuth, userController.getAllStudents);
router.delete('/tutor/:id', isAuth, userController.deleteStudentById);


router.put("/:id/password", isAuth, userController.updatePassword);
router.put("/:id", isAuth, userController.updateUser);
router.get("/:id", isAuth, userController.getUser);
router.post("/:id/schedule/new", isAuth, userController.createSchedule);

module.exports = router;