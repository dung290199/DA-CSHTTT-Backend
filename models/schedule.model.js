const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  tutorName: {
    type: String,
    required: true
  },
  subject: [{
    type: String,
    required: true
  }],
  grade: [{
    type: String,
    required: true
  }],
  time: [{ type: String }],
  address: [{type: String}],
  price: {
    type: Number,
  },
  status: {
    type: Number,
    default: 0, // 0 : chua duyet,  1 :tutor duyet,
  },
  // students: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "student",
  //   },
  // ],
  time_created: {
    type: Date,
    default: new Date(),
  },
  image: {
    type: String,
  },
});

const Schedule = mongoose.model("schedule", scheduleSchema);
module.exports = Schedule;