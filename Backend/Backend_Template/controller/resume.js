const multer = require("multer");
const pdf = require("pdf-parse");
const path = require("path");
const fs = require("fs");

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads"); // Upload directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage }).single("resume");

const extractSkillsSection = (pdfText) => {
    const skillsSectionRegex = /TECHNICALSKILLS\n([\s\S]*?)(\n\n|\n\s*PROJECTS)/;
    const match = pdfText.match(skillsSectionRegex);
    return match ? match[1].trim() : "Skills section not found";
};

const resumeReading = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: "Error uploading file", details: err.message });
        }

        try {
            const filePath = req.file.path; 

            const dataBuffer = fs.readFileSync(filePath);
            const pdfData = await pdf(dataBuffer);

            // Extract the skills section from the PDF text
            const skillsContent = extractSkillsSection(pdfData.text);

            res.status(200).json({
                message: "File uploaded and read successfully",
                skills: skillsContent
            });
        } catch (error) {
            console.error("Error reading PDF:", error);
            res.status(500).json({ error: "Error reading PDF", details: error.message });
        }
    });
};

module.exports = {resumeReading};
