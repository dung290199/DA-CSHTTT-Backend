const User = require('../models/user.model');
const Schedule = require('../models/schedule.model');
const auth = require('../middlewares/auth.middleware');
const CV = require('../models/cv.model');
const config = require('../config');
const { checkPassword, hashPassword, getToken } = require('../middlewares/auth.middleware');
const mongoose = require('mongoose');

module.exports = {
  createSchedule: async (req, res, next) => {
    const { tutorId, tutorName, subject, grade, time, price, image, address } = req.body;
    const schedule = new Schedule({
      tutorId: tutorId,
      tutorName: tutorName,
      subject: subject,
      grade: grade,
      time: time,
      price: price,
      image: image,
      address: address
    });

    const newSchedule = await schedule.save();
    if (newSchedule) {
      return res.status(201).send({
        _id: newSchedule.id,
        time: newSchedule.time,
        status: newSchedule.status,
        time_created: newSchedule.time_created,
        tutorId: newSchedule.tutorId,
        tutorName: newSchedule.tutorName,
        subject: newSchedule.subject,
        grade: newSchedule.grade,
        price: newSchedule.price,
        image: newSchedule.image,
        address: newSchedule.address
      });
    } else {
      return res.status(401).send({ message: "Invalid schedule data" });
    }
  },
  
  getUser: async (req, res, next) => {
    const id = req.params;
    const user = await User.findById(id);

    if (user) {
      let data = {
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullname: user.fullname,
        birthday: user.birthday,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        picture: user.picture,
      };

      const cv = (user.role === 'TUTOR') ? await CV.findOne({tutorId: user.id}) : null;

      data = cv ? Object.assign({}, data, { ...data, CV: user.CV }) : data;
        
      console.log("data", data);
      return res.status(200)
              .send({ data: data });
    }
    return res.status(404).send({ message: "User not found" });
  },

  updateUser: async (req, res, next) => {
    const id = req.params.id;
    const { username, email, fullname, birthday, phone, address, gender, picture } = req.body;
    const user = await User.findOne({_id: id});
    user.username = username,
    user.email = email,
    user.fullname = fullname,
    user.birthday = birthday,
    user.phone = phone,
    user.address = address,
    user.gender = gender,
    user.picture = picture
    const updatedUser = await user.save();

    if (updatedUser) {
      let data = {
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        fullname: updatedUser.fullname,
        birthday: updatedUser.birthday,
        phone: updatedUser.phone,
        address: updatedUser.address,
        gender: updatedUser.gender,
        picture: updatedUser.picture,
      };

      const cv = (updatedUser.role === 'TUTOR') ? await CV.findOne({tutorId: updatedUser.id}) : null;

      data = cv ? Object.assign({}, data, { ...data, CV: user.CV }) : data;
        
      console.log("data", data);
      return res.status(200)
              .send({ data, message: "Change password success!" });
    }
    return res.send({ message: "Update user failed!!" });
  },

  updatePassword: async (req, res, next) => {
    const id = req.params.id;
    const { oldPassword, newPassword } = req.body;
    // const newId = mongoose.Types.ObjectId(id);
    console.log("id: ", id);
    const user = await User.findOne({_id: id});
    if (!user) {
      return res.send({message: "User not existed!"});
    }

    console.log("pass: ", user.password);
    console.log("oldPass: ", checkPassword("abc", "abc"));

    if (!checkPassword(oldPassword, user.password)) {
      return res.status(401).send({message: "Old password is not exact!"});
    }
    user.password = await hashPassword(newPassword);
    const updatedUser = await user.save();

    if (updatedUser) {
      let data = {
        _id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        fullname: updatedUser.fullname,
        birthday: updatedUser.birthday,
        phone: updatedUser.phone,
        address: updatedUser.address,
        gender: updatedUser.gender,
        picture: updatedUser.picture,
      };

      const cv = (updatedUser.role === 'TUTOR') ? await CV.findOne({tutorId: updatedUser.id}) : null;

      data = cv ? Object.assign({}, data, { ...data, CV: user.CV }) : data;
        
      console.log("data", data);
      return res.status(200)
              .send({ data: data, message: "Change password success!" });
    }
    return res.send({message: "Change password failed!"});
  },

  createAdmin: async (req, res, next) => {
    const hashedPassword = await hashPassword("admin");
    const admin = new User({
      username: "admin",
      password: hashedPassword,
      email: "admin@gmail.com",
      role: "ADMIN",
      fullname: "admin",
      birthday: "29/08/1999",
      gender: true,
      isAdmin: true,
      phone: "01478963215"
    });
    
    const newAdmin = await admin.save();
    if (newAdmin) {
      const token = getToken(newAdmin);
      let data = {
        token: token,
        user: {
          _id: newAdmin.id,
          username: newAdmin.username,
          password: newAdmin.password,
          email: newAdmin.email,
          role: newAdmin.role,
          fullname: newAdmin.fullname,
          birthday: newAdmin.birthday,
          phone: newAdmin.phone,
          address: newAdmin.address,
          gender: newAdmin.gender,
          picture: newAdmin.picture,
        }
      }
      return res.status(201)
              .header('auth-token', token)
              .send(data);
    } else {
      return res.status(401).send({ message: "Invalid admin data" });
    }
  }
};