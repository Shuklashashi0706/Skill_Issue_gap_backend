const express = require("express");
const {resumeReading}  = require("../controller/resume.js");
const resumeRouter = express.Router();

resumeRouter.post("/postResume", resumeReading);
// router.post("/postJob", postJob);

module.exports = resumeRouter;
