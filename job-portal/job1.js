// Fetch job ID from query parameters
const params = new URLSearchParams(window.location.search);
const jobId = params.get("id");

// API URLs
const jobApiUrl = `http://localhost:3000/api/v1/job/getjobs`;
const resumeApiUrl = `http://localhost:3000/api/v1/resume/postResume`;

let jobDetails = null; // To store job details for submission

async function fetchJobDetails() {
  try {
    // Fetch jobs from the API
    const response = await fetch(jobApiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const jobs = await response.json(); // Parse JSON data
    const job = jobs.find((j) => j._id === jobId); // Find the job with the matching ID

    if (!job) {
      throw new Error("Job not found!");
    }

    // Store job details for submission
    jobDetails = job;

    // Populate HTML with job details
    document.getElementById("job-title").textContent = job.jobTitle;
    document.getElementById(
      "job-info"
    ).innerHTML = `<strong>Job Description:</strong> ${job.jobInfo}`;

    const responsibilitiesList = document.getElementById(
      "job-responsibilities"
    );
    responsibilitiesList.innerHTML = ""; // Clear existing content
    job.jobResponsibilities.forEach((responsibility) => {
      const li = document.createElement("li");
      li.textContent = responsibility;
      responsibilitiesList.appendChild(li);
    });

    const requirementsList = document.getElementById("job-requirements");
    requirementsList.innerHTML = ""; // Clear existing content
    job.jobReq.forEach((requirement) => {
      const li = document.createElement("li");
      li.textContent = requirement;
      requirementsList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching job details:", error);
    document.getElementById("job-details").innerHTML =
      "<p>Error loading job details. Please try again later.</p>";
  }
}

// Handle Resume Upload and Submit Job Details
document
  .getElementById("resume-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission
    const message = document.getElementById("upload-message");
    const submitButton = event.target.querySelector('button[type="submit"]');

    try {
      // Disable submit button during submission to prevent multiple clicks
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";

      const formData = new FormData();

      // Append the resume file
      const fileInput = document.getElementById("resume");
      const file = fileInput.files[0];
      if (!file) {
        message.textContent = "Please upload a resume.";
        message.style.color = "red";
        submitButton.disabled = false;
        submitButton.textContent = "Submit";
        return;
      }

      formData.append("resume", file);

      // Append job details
      formData.append("jobId", jobDetails._id);
      formData.append("jobTitle", jobDetails.jobTitle);
      formData.append("jobInfo", jobDetails.jobInfo);
      formData.append(
        "jobResponsibilities",
        JSON.stringify(jobDetails.jobResponsibilities)
      );
      formData.append("jobReq", JSON.stringify(jobDetails.jobReq));

      // Send data to backend
      const response = await fetch(resumeApiUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      message.textContent =
        responseData.message || "Resume submitted successfully!";
      message.style.color = "green";

      // Optional: Clear the file input after successful submission
      fileInput.value = "";
    } catch (error) {
      console.error("Error submitting resume:", error);
      message.textContent = "Error submitting resume. Please try again.";
      message.style.color = "red";
    } finally {
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = "Submit";
    }
  });

// Fetch and display job details on page load
fetchJobDetails();
