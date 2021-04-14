const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
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
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
