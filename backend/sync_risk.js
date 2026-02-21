const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Student = require('./models/Student');
const { updateStudentIntelligence } = require('./services/studentIntelligence');

const syncAllStudents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        const students = await Student.find({});
        console.log(`Found ${students.length} students. Syncing intelligence...`);

        let count = 0;
        for (const student of students) {
            await updateStudentIntelligence(student._id);
            count++;
            if (count % 10 === 0) {
                console.log(`Synced ${count}/${students.length} students...`);
            }
        }

        console.log(`\nSuccessfully synced intelligence for all ${students.length} students.`);
        process.exit(0);
    } catch (error) {
        console.error("Error during sync:", error);
        process.exit(1);
    }
};

syncAllStudents();
