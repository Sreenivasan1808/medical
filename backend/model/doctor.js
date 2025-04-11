const mongoose = require("mongoose");
const doctorSchema = mongoose.Schema({
  doctorId: {
    type: String,
    required: true,
    unique: true,
  },
  doctorName: {
    type: String,
    required: true,
    unique: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  specialization: {
    type: String
  }
});
module.exports = mongoose.model("Doctor", doctorSchema);
