const authController = require("../controller/auth/authController");
const express = require("express");
const router = express.Router();

router.post('/login', authController.login);
router.post('/register/patient', authController.registerPatient);
router.post('/register/doctor', authController.registerDoctor);

module.exports = router;