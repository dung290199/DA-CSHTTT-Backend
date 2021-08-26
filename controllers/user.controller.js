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
    if (!req.user.isAdmin && !req.user._id.equals(id)) return res.status(401).send({ message: "Unauthorized!" });
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

    try {
      const updatedUser = await user.save();
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
    } catch(e) {
      console.log(e);
      return res.send({ message: "Update user failed!!" });
    }
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

    try {
      const updatedUser = await user.save();
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
    } catch(e) {
      console.log(e);
      return res.send({message: "Change password failed!"});
    }
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
    
    try {
      const newAdmin = await admin.save();
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
    } catch(e) {
      console.log(e);
      return res.status(401).send({ message: "Invalid admin data" });
    }
  },

  createSchedule: async (req, res, next) => {
    const { day, time } = req.body;
    const schedule = new Schedule({
      day: day,
      time: time,
    });

    try {
      const newSchedule = await schedule.save();
      return res.status(201).send({
        _id: newSchedule.id,
        day: newSchedule.day,
        time: newSchedule.time,
        time_created: newSchedule.time_created,
      });
    } catch(e) {
      console.log(e);
      return res.status(401).send({ message: "Invalid schedule data" });
    }
  },

  createCourse: async (req, res, next) => {
    const { name, tutorName, students, schedules, subject, grade, address } = req.body;
    console.log("req.body: ", req.body, req.user);
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

    console.log(course);
    try {
      const newCourse = await course.save();
      console.log("newCourse: ", newCourse);
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
    } catch(e) {
      console.log(e);
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

  getRegisterRequestsOfStudent: async (req, res, next) => {
    console.log("go in");
    const registerCourseRequests = await RegisterCourse.find({ 'student_id': req.user._id });
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
    console.log("go in");
    console.log("registerRequset_id: ", registerRequset_id);
    if (registerRequest && (registerRequest.tutor_id.equals(req.user._id) || registerRequest.student_id.equals(req.user._id))) {
      registerRequest.remove((err, doc) => {
        if (err) {
          return res.status(500).send({ message: "Failed to remove register request!" });
        } else {
          return res.status(200).send({ message: "Delete success" });
        }
      })
    } else {
      return res.status(400).send({ message: "Request not found!" });
    }
  },

  registerCourse: async (req, res, next) => {
    const { tutor_id, student_id, course_id } = req.body;
    const registerCourse = new RegisterCourse({
      tutor_id: tutor_id,
      student_id: student_id,
      course_id: course_id
    });

    try {
      const savedRegisterCourse = await registerCourse.save();
      return res.status(200).send({ savedRegisterCourse });
    } catch(e) {
      console.log(e);
      return res.status(400).send({ message: 'Failed to create request to register course!' })
    }
  },

  addStudentToCourse: async (req, res, next) => {
    // console.log('request: ', req);
    const { _id } = req.body;
    // console.log('student, course: ', student_id, course_id);
    const registerRequest = await RegisterCourse.findOne({ _id });
    if (registerRequest) {
      console.log("registerRequest: ", registerRequest);
      const student = await User.findOne({ _id: registerRequest.student_id });
      const course = await Course.findOne({ _id: registerRequest.course_id });
      console.log("student: ", student);
      console.log("course: ", course);
      if (course && student) {
        const studentArray = course.students;
        studentArray.push(student);
        // console.log('studentArray: ', studentArray);
        course.students = studentArray;
        try {
          console.log('success');
          const savedCourse = await course.save();
          registerRequest.remove((err, doc) => {
            if (err) {
              return res.status(500).send({ message: "Failed to remove register request!" });
            } else {
              return res.status(200).send({ message: "Delete success" });
            }
          })
          return res.status(200).send({
            _id: savedCourse.id,
          })
        } catch(e) {
          console.log(e);
          return res.status(400).send({ message: 'Failed to add student to class!' })
        }
      }
    }

    return res.status(400).send({ message: 'Register request is not existed!' });
    
  },

  createGrade: async (req, res, next) => {
    const { name } = req.body;

    const grade = new Grade({ name: name });
    try {
      const newGrade = await grade.save();
      console.log('newGrade: ', newGrade);
      return res.status(200).send({
        _id: newGrade.id,
        name: newGrade.name
      })
    } catch(e) {
      console.log(e);
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
    try {
      const newSubject = await subject.save();
      return res.status(200).send({
        _id: newSubject.id,
        name: newSubject.name
      })
    } catch(e) {
      console.log(e);
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

  getAllTutors: async (req, res, next) => {
    const tutors = await User.find({ role: 'TUTOR' });
    if (tutors) {
      return res.status(200).send({ tutors });
    } else {
      return res.status(400).send({ message: 'Failed to get list of tutors!' })
    }
  },

  deleteTutorById: async (req, res, next) => {
    const { id } = req.params;
    const tutor = await User.findOne({ _id: id, role: 'TUTOR' });
    if (tutor) {
      tutor.remove((err, doc) => {
        if (err) {
          return res.status(400).send({ message: "Failed to delete tutor!" });
        } else {
          return res.status(200).send({ message: 'Delete success!' })
        }
      })
    } else {
      return res.status(400).send({ message: 'Tutor not found!' })
    }
  },

  getUserById: async (req, res, next) => {
    const { id } = req.params;
    console.log("id: ", id);
    const user = await User.findOne({ _id: id });
    console.log("user: ", user);
    if (user) {
      return res.status(200).send({ user });
    } else {
      return res.status(400).send({ message: 'User not found!' })
    }
  },

  // getOwnedStudents: async (req, res, next) => {
  //   const tutors = await User.find({ role: 'STUDENT' });
  //   if (tutors) {
  //     return res.status(200).send({ tutors });
  //   } else {
  //     return res.status(400).send({ message: 'Failed to get list of students!' })
  //   }
  // },

  getAllStudents: async (req, res, next) => {
    const students = await User.find({ role: 'STUDENT' });
    if (students) {
      return res.status(200).send({ students });
    } else {
      return res.status(400).send({ message: 'Failed to get list of students!' })
    }
  },

  deleteStudentById: async (req, res, next) => {
    const { id } = req.params;
    const student = await User.findOne({ _id: id, role: 'STUDENT' });
    if (tutor) {
      student.remove((err, doc) => {
        if (err) {
          return res.status(400).send({ message: "Failed to delete student!" });
        } else {
          return res.status(200).send({ message: 'Delete success!' })
        }
      })
    } else {
      return res.status(400).send({ message: 'Student not found!' })
    }
  },
};