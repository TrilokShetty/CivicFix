const { classifyToDepartment } = require('./utils/nlp');
const mongoose = require('mongoose');

// Mock .env loading
require('dotenv').config();

const testClassification = async () => {
    console.log("Testing Classification...");

    // Test cases
    const tests = [
        "The streetlight on Main St is out.",
        "There is a huge pothole damaging cars.",
        "Garbage hasn't been collected for weeks."
    ];

    for (const text of tests) {
        console.log(`\nInput: "${text}"`);
        const dept = await classifyToDepartment(text);
        console.log(`Classified Department: ${dept}`);
    }
};

testClassification();
