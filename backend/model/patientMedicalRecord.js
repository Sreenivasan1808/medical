const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  }
});

const patientRecordSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      ref: 'Doctor',
      required: true,
    },
    patientId: {
      type: String,
      required: true,
    },
    lastVisitDate: {
      type: Date,
      required: true,
    },
    nextVisitDate: {
      type: Date,
      required: true,
    },
    currentDiagnosis: {
      type: String,
      required: true,
    },
    aiDiagnosis:{
      type:String,
    },
    medication: {
      type: [medicationSchema],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PatientRecord", patientRecordSchema);
