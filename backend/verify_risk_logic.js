const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Student = require('./models/Student');
const { updateStudentIntelligence } = require('./services/studentIntelligence');

const runTest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB.");

        const testCases = [
            { gpa: 9.0, att: 90, expected: 'Low', desc: "Perfect" },
            { gpa: 7.5, att: 90, expected: 'Low', desc: "GPA 7.5 (1pt) + Att 90 (0pt) = 1 pt -> Low" },
            { gpa: 6.5, att: 80, expected: 'Medium', desc: "GPA 6.5 (2pts) + Att 80 (1pt) = 3 pts -> Medium" },
            { gpa: 5.5, att: 70, expected: 'High', desc: "GPA 5.5 (3pts) + Att 70 (2pts) = 5 pts -> High" },
            { gpa: 3.0, att: 90, expected: 'Critical', desc: "Hard rule GPA < 4.0 => Critical" },
            { gpa: 8.0, att: 40, expected: 'Critical', desc: "Hard rule ATT < 50 => Critical" }
        ];

        let passed = 0;

        for (const tc of testCases) {
            // Setup mock student in db
            const sId = "TST-" + Math.floor(Math.random() * 100000);
            let student = new Student({
                studentId: sId,
                name: "Test Student",
                email: sId + "@test.com",
                department: "Test",
                currentSemester: 1,
                lifecycleStage: "Academic",
                gpa: tc.gpa,
                attendancePercentage: tc.att,
                riskStatus: "Low"
            });
            await student.save();

            // run intelligence
            await updateStudentIntelligence(student._id);

            // fetch updated
            student = await Student.findById(student._id);

            console.log(`Test: ${tc.desc} | GPA: ${tc.gpa}, Att: ${tc.att} | Expected: ${tc.expected}, Got: ${student.riskStatus}`);
            if (student.riskStatus === tc.expected) passed++;
            else console.error(`---> FAILED! Expected: ${tc.expected}, Got: ${student.riskStatus}`);

            await Student.deleteOne({ _id: student._id });
        }

        console.log(`\nResults: Passed ${passed} / ${testCases.length}`);
        process.exit(passed === testCases.length ? 0 : 1);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

runTest();
