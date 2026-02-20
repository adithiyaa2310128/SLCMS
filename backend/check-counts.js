const mongoose = require('mongoose');
require('dotenv').config();
const Alumni = require('./models/Alumni');
const Attendance = require('./models/Attendance');

const checkCounts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const alumniCount = await Alumni.countDocuments();
        const attendanceCount = await Attendance.countDocuments();

        console.log(`Summary Counts:`);
        console.log(`- Alumni: ${alumniCount}`);
        console.log(`- Attendance: ${attendanceCount}`);

        process.exit(0);
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
};

checkCounts();
