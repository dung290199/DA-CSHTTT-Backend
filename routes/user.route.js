const express = require('express');

const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const isAuth = authMiddleware.isAuth;

// router.post('/schedule/new', authMiddleware.isAuth, tutorController.createSchedule);
router.put("/:id/password", isAuth, userController.updatePassword);
router.put("/:id", isAuth, userController.updateUser);
router.get("/:id", isAuth, userController.getUser);
router.post("/:id/schedule/new", isAuth, userController.createSchedule);

module.exports = router;