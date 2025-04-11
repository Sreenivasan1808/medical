const express = require("express");
const router = express.Router();
const patientController = require("../controller/patientController");

router.get('/:patientId', patientController.getPatientDetails);

module.exports = router;