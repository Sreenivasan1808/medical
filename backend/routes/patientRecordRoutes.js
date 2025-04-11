const express = require("express");
const router = express.Router();
const patientRecordController = require("../controller/patientRecordController");

router.post("/", patientRecordController.addPatientRecord);
router.put("/:id", patientRecordController.editPatientRecord);
router.delete(
  "/:id",
  patientRecordController.removePatientRecord
);
router.get("/doctor/:doctorId", patientRecordController.getPatientRecordsByDoctor);
router.get("/patient/:patientId", patientRecordController.getPatientRecordsByPatient);

module.exports = router;
