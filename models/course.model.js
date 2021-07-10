const mongoose = require("mongoose");
const { gradeSchema } = require("./grade.model");
const { scheduleSchema } = require("./schedule.model");
const { subjectSchema } = require("./subject.model");
const { userSchema } = require("./user.model");

const registerCourseSchema = new mongoose.Schema({
  tutor_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

const courseSchema = new mongoose.Schema({
  tutor: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  name: {
    type: String,
    required: true,
  },
  students: [userSchema],
  schedules: [scheduleSchema],
  subject: {
    type: subjectSchema,
    required: true,
  },
  grade: {
    type: gradeSchema,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const Course = mongoose.model("Course", courseSchema);
const RegisterCourse = mongoose.model("RegisterCourse", registerCourseSchema);
module.exports = { Course, RegisterCourse };
