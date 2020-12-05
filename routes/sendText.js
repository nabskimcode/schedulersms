const express = require("express");
const router = express.Router();

const { createSMS } = require("../controllers/sendText");

// uncomment to mount router to function
//router.post("/api", createSMS);

module.exports = router;
