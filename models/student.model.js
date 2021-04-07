const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true 
  },
  fullname: {
    type: String,
    required: true,
  },
  birthday: {
    type: String,
    isRequired: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: "",
  },
  gender: {
    type: Boolean,
    isRequired: true,
  },
  picture: {
    type: String,
    default: "",
  },
  role: {
    type: Number,
    default: 0,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: true,
  },
});
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
