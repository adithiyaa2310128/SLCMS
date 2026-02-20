require("dotenv").config();
const mongoose = require("mongoose");
const Alumni = require("./models/Alumni");

const seedAlumni = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected for seeding...");

        // Check if alumni already exist
        const count = await Alumni.countDocuments();
        if (count > 0) {
            console.log(`Alumni collection already has ${count} entries. Skipping seed.`);
            process.exit(0);
        }

        const dummyAlumni = [
            {
                name: "Rahul Sharma",
                email: "rahul.sharma@google.com",
                company: "Google",
                jobRole: "Senior Software Engineer",
                department: "Computer Science",
                batch: "2020",
                linkedin: "https://linkedin.com/in/rahulsharma",
                bio: "Passionate about distributed systems and cloud computing. Happy to mentor students interested in tech careers at Google.",
                skills: ["Python", "Go", "Cloud Computing", "System Design"],
                yearsOfExperience: 4,
                available: true
            }
        ];

        await Alumni.insertMany(dummyAlumni);
        console.log("✅ Dummy alumni entry created successfully!");
        console.log("Alumni:", JSON.stringify(dummyAlumni[0], null, 2));

        process.exit(0);
    } catch (error) {
        console.error("❌ Seed error:", error.message);
        process.exit(1);
    }
};

seedAlumni();
