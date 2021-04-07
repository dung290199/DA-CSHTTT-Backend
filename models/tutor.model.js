const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
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
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: "",
    required: true,
  },
  gender: {
    type: Boolean,
    required: true,
  },
  role: {
    type: Number,
    default: 1,
  },
  picture: {
    type: String,
    default: "",
  },
  CV: {
    type: String,
    default: "",
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: true,
  },
});
const Tutor = mongoose.model("Tutor", tutorSchema);
module.exports = Tutor;
