const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  jobInfo: {
    type: String,
    required: true,
  },
  jobDesc: [
    {
      type: String,
      required: true,
    },
  ],
  jobResponsibilities: [
    {
      type: String,
      required: true,
    },
  ],
  jobReq: [
    {
      type: String,
      required: true,
    },
  ],
});

jobSchema.post("save", (doc) => {
  console.log("Job saved:", doc._id);
});

const jobModel = mongoose.model("Job", jobSchema);

module.exports = jobModel;
