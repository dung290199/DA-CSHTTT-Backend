const { User } = require('../models/user.model');
const { Schedule } = require('../models/schedule.model');
const { Course, RegisterCourse } = require('../models/course.model');
const auth = require('../middlewares/auth.middleware');
const CV = require('../models/cv.model');
const config = require('../config');
const { Grade } = require('../models/grade.model');
const { Subject } = require('../models/subject.model');
const { checkPassword, hashPassword, getToken } = require('../middlewares/auth.middleware');
const mongoose = require('mongoose');

module.exports = {  
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
    console.log('update user');
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
              .send({ data, message: "Update user success!" });
    }
    return res.send({ message: "Update user failed!!" });
  },

  updatePassword: async (req, res, next) => {
    const id = req.params.id;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findOne({_id: id});
    if (!user) {
      return res.send({message: "User not existed!"});
    }

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
  },

  createSchedule: async (req, res, next) => {
    const { day, time } = req.body;
    const schedule = new Schedule({
      day: day,
      time: time,
    });

    const newSchedule = await schedule.save();
    if (newSchedule) {
      return res.status(201).send({
        _id: newSchedule.id,
        day: newSchedule.day,
        time: newSchedule.time,
        time_created: newSchedule.time_created,
      });
    } else {
      return res.status(401).send({ message: "Invalid schedule data" });
    }
  },

  createCourse: async (req, res, next) => {
    const { name, tutorName, students, schedules, subject, grade, address } = req.body;
    const course = new Course({
      tutor: {
        _id: req.user._id,
        name: tutorName,
      },
      name: name,
      students: students,
      schedules: schedules,
      subject: subject,
      grade: grade,
      address: address
    });

    const newCourse = await course.save();
    if (newCourse) {
      return res.status(200).send({
        _id: newCourse.id,
        name: newCourse.name,
        tutor: {
          _id: newCourse.tutor._id,
          name: newCourse.tutor.name
        },
        students: newCourse.students,
        schedules: newCourse.schedules,
        subject: newCourse.subject,
        grade: newCourse.grade,
        address: newCourse.address
      })
    } else {
      return res.status(401).send({ message: 'Invalid course data!' });
    }
  },

  getCourseById: async (req, res, next) => {
    const { course_id } = req.params;
    const course = await Course.findOne({ _id: course_id });
    if (course) {
      return res.status(200).send({ course });  
    } else {
      return res.status(400).send({ message: 'Failed to get course!' })
    }
  },

  getCourses: async (req, res, next) => {
    let courses;
    if (req.user.role === 'TUTOR') {
      courses = await Course.find({ "tutor._id": req.user._id });
      console.log('user: ', req.user);
    } else {
      courses = await Course.find({"students._id": req.user._id});
      console.log('students courses: ', courses);
    }
    if (courses) {
      return res.status(200).send({ courses });  
    } else {
      return res.status(400).send({ message: 'Failed to create courses!' })
    }
  },

  getAllCourses: async (req, res, next) => {
    const courses = await Course.find({});
    if (courses) {
      return res.status(200).send({ courses });  
    } else {
      return res.status(400).send({ message: 'Failed to get all of courses!' })
    }
  },

  getAllRegisterCourseRequests: async (req, res, next) => {
    console.log("go in");
    const registerCourseRequests = await RegisterCourse.find({ 'tutor_id': req.user._id });
    if (registerCourseRequests) {
      console.log("register: ", registerCourseRequests);
      return res.status(200).send({ registerCourseRequests });  
    } else {
      return res.status(400).send({ message: 'Failed to get all of register-course requests!' })
    }
  },

  removeRegisterCourseRequest: async (req, res, next) => {
    const { registerRequset_id } = req.params;
    const registerRequest = await RegisterCourse.findOne({ _id: registerRequset_id });

    if (registerRequest.tutor_id.equals(req.user._id)) {
      registerRequest.remove((err, doc) => {
        if (err) {
          console.log('err: ', err);
        } else {
          console.log('doc: ', doc);
        }
      })
    } else {
      console.log('failed!!!!!!!!!!!');
      console.log('registerRequest: ', registerRequest);
      console.log('request: ', req.user);
      return res.status(400).send({ message: "Request not found!" });
    }
    const registerCourseRequests = await RegisterCourse.find({ 'tutor_id': req.user._id });
    if (registerCourseRequests) {
      console.log("register: ", registerCourseRequests);
      return res.status(200).send({ registerCourseRequests });  
    } else {
      return res.status(400).send({ message: 'Failed to get all of register-course requests!' })
    }
  },

  registerCourse: async (req, res, next) => {
    const { tutor_id, student_id, course_id } = req.body;
    const registerCourse = new RegisterCourse({
      tutor_id: tutor_id,
      student_id: student_id,
      course_id: course_id
    });

    const savedRegisterCourse = await registerCourse.save();
    if (savedRegisterCourse) {
      return res.status(200).send({ savedRegisterCourse });
    } else {
      return res.status(400).send({ message: 'Failed to create request to register course!' })
    }
  },

  addStudentToCourse: async (req, res, next) => {
    console.log('request: ', req);
    const { student_id, course_id } = req.body;
    console.log('student, course: ', student_id, course_id);
    const student = await User.findOne({ _id: student_id });
    const course = await Course.findOne({ _id: course_id });
    const studentArray = course.students;
    studentArray.push(student);
    console.log('studentArray: ', studentArray);
    course.students = studentArray;
    const savedCourse = await course.save();
    if (savedCourse) {
      console.log('success');
      return res.status(200).send({
        _id: savedCourse.id,
      })
    } else {
      return res.status(400).send({ message: 'Failed to add student to class!' })
    }
  },

  createGrade: async (req, res, next) => {
    const { name } = req.body;

    const grade = new Grade({ name: name });
    const newGrade = await grade.save();
    if (newGrade) {
      console.log('newGrade: ', newGrade);
      return res.status(200).send({
        _id: newGrade.id,
        name: newGrade.name
      })
    } else {
      return res.status(400).send({ message: 'Failed to create grade!' })
    }
  },

  getGrades: async (req, res, next) => {
    const grades = await Grade.find({});
    if (grades) {
      return res.status(200).send({ grades });  
    } else {
      return res.status(400).send({ message: 'Failed to create grade!' })
    }
  },

  createSubject: async (req, res, next) => {
    const { name } = req.body;

    const subject = new Subject({ name: name });
    const newSubject = await subject.save();
    if (newSubject) {
      return res.status(200).send({
        _id: newSubject.id,
        name: newSubject.name
      })
    } else {
      return res.status(400).send({ message: 'Failed to create grade!' })
    }
  },

  getSubjects: async (req, res, next) => {
    const subjects = await Subject.find({});
    if (subjects) {
      return res.status(200).send({ subjects });
    } else {
      return res.status(400).send({ message: 'Failed to create grade!' })
    }
  },
};