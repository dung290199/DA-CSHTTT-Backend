const express = require('express');

const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// router.post('/schedule/new', authMiddleware.isAuth, tutorController.createSchedule);
router.get("/user/:id", authMiddleware.isAuth, userController.getUser);
router.put("/user/:id", authMiddleware.isAuth, userController.updateUser);
router.put("/user/:id/password", authMiddleware.isAuth, userController.updatePassword);

module.exports = router;