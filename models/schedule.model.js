const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    require: true
  },
  time: {
    type: String,
    require: true
  },
  time_created: {
    type: Date,
    default: new Date(),
  },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = { Schedule, scheduleSchema };