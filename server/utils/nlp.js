const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();

// Initialize Gemini
// Ensure you have GEMINI_API_KEY in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Uses Gemini AI to classify the problem into a department
 * @param {string} description - The user's problem report
 * @returns {Promise<string>} - The classified department
 */
const classifyToDepartment = async (description) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: `
                You are a city management assistant. 
                Classify the user's report into EXACTLY one of these three departments:
                1. Electrical (For streetlights, wires, power issues)
                2. Public Works (For roads, potholes, sidewalks, infrastructure)
                3. Sanitation (For trash, sewage, recycling, litter)
                
                If the report is vague, pick the closest match. 
                Respond with ONLY the department name.
            `
        });

        const result = await model.generateContent(description);
        const department = result.response.text().trim();

        // Safety validation
        const validDepts = ['Electrical', 'Public Works', 'Sanitation'];
        return validDepts.includes(department) ? department : 'Admin';

    } catch (error) {
        console.error("AI API Error:", error);
        return 'Admin'; // Fallback if API fails or rate limit hit
    }
};

module.exports = { classifyToDepartment };
