const jobModal = require("../models/job.js");

const getAllJobs = async (req, res) => {
  try {
    const jobs = await jobModal.find();
    res.status(200).json(jobs);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch jobs", details: err.message });
  }
};

const postJob =  async (req, res) => {
  try {
    const jobData = req.body;
    const newJob = new jobModal(jobData);
    await newJob.save();
    res.status(201).json({ message: "Job created successfully", job: newJob });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create job", details: err.message });
  }
};

module.exports = {getAllJobs,postJob} ;
