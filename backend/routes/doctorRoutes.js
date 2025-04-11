const express = require("express");
const router = express.Router();
const doctorController = require("../controller/doctorController");

router.get("/:doctorId", doctorController.getDoctorById);

module.exports = router;
