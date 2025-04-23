const express = require("express");
const router = express.Router();
const mlController = require("../controller/mlController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/predict", upload.single("file"), mlController.predictParkinsonDisease);

module.exports = router;
