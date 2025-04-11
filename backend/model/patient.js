const mongoose = require("mongoose");
const patientSchema = mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true,
  },
  patientName: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model("Patient", patientSchema);
