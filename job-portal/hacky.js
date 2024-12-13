let speaking = false; // Track if speech is in progress

// Function to stop any current speech
function stopSpeech() {
  window.speechSynthesis.cancel();
}

document.querySelector(".volume-btn").addEventListener("click", toggleReading);

function toggleReading() {
  if (speaking) {
    stopSpeech(); // Stop reading if it's currently speaking
  } else {
    // Select all text elements on the page
    const allTextElements = document.querySelectorAll(
      "h1, h2, h3, p, .job-card"
    ); // Add more selectors if necessary
    let fullText = "";

    // Concatenate text from all selected elements
    allTextElements.forEach((element) => {
      fullText += element.innerText || element.textContent + " ";
    });

    // Create a SpeechSynthesisUtterance with all the concatenated text
    const speech = new SpeechSynthesisUtterance(fullText);
    speech.lang = "en-US"; // Set the language to English

    // Handle the end of speech
    speech.onend = function () {
      speaking = false; // Reset speaking state when done
    };

    // Start speaking the concatenated text
    window.speechSynthesis.speak(speech);
    speaking = true; // Mark as speaking
  }
}

async function fetchJobs() {
  try {
    // Fetch jobs from the API
    const response = await fetch("http://localhost:3000/api/v1/job/getjobs");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const jobs = await response.json(); // Parse JSON data
    const jobCardsContainer = document.getElementById("job-cards");

    // Clear any existing content
    jobCardsContainer.innerHTML = "";

    // Loop through the jobs and create job cards
    jobs.forEach((job) => {
      const jobCard = document.createElement("div");
      jobCard.className = "job-card";
      jobCard.ondblclick = () =>
        (window.location.href = `job1.html?id=${job._id}`);
      jobCard.onclick = () => readJobText(job);

      // Populate job card with title and info
      jobCard.innerHTML = `
          <h3>${job.jobTitle}</h3>
          <p>${job.jobInfo}</p>
        `;

      jobCardsContainer.appendChild(jobCard);
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
}

function readJobText(job) {
//   const jobText = `Job Title: ${job.jobTitle}. Job Information: ${job.jobInfo}`;
//   const speech = new SpeechSynthesisUtterance(jobText);
//   speech.lang = "en-US";
//   window.speechSynthesis.speak(speech);
}

// Fetch and display jobs when the page loads
window.onload = fetchJobs;
