const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();
const { getAdminStats } = require('./controllers/dashboardController');

// Mock req and res
const req = {};
const res = {
    status: (code) => ({
        json: (data) => {
            const output = {
                statusCode: code,
                data: data
            };
            fs.writeFileSync('test-output.json', JSON.stringify(output, null, 2));
            console.log("Output saved to test-output.json");
        }
    })
};

const testController = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await getAdminStats(req, res);
        process.exit(0);
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
};

testController();
