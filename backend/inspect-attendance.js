const mongoose = require('mongoose');
require('dotenv').config();
const Attendance = require('./models/Attendance');

const inspectAttendance = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const records = await Attendance.find().limit(5);
        console.log("Recent Attendance Records:", JSON.stringify(records, null, 2));
        process.exit(0);
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
};

inspectAttendance();
