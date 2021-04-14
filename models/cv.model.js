const mongoose = require("mongoose");

const cvSchema = new mongoose.Schema({
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  CV: {
    type: String,
    default: "",
    required: true,
  },
});
const CV = mongoose.model("CV", cvSchema);
module.exports = CV;
