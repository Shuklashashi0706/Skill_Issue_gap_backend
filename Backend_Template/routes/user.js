const express = require("express");
const { postJob, getAllJobs } = require("../controller/job.js");
const router = express.Router();

router.get("/getjobs", getAllJobs);
router.post("/postJob", postJob);

module.exports = router;
