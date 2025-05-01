const express = require("express");
const router = express.Router();
const mlController = require("../controller/mlController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/predict/parkinson", upload.single("file"), mlController.predictParkinsonDisease);
router.post("/predict/diabetes", upload.single("file"), mlController.predictDiabetes);

module.exports = router;
