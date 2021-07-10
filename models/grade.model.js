const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
});

const Grade = mongoose.model("Grade", gradeSchema);
module.exports = { Grade, gradeSchema };
