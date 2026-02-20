require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected for seeding admin...");

        const adminEmail = "admin@slcms.com";
        const adminPassword = "admin123";

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log(`Admin user with email ${adminEmail} already exists. Skipping seed.`);
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Create admin
        const adminUser = new User({
            name: "Default Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "Admin"
        });

        await adminUser.save();
        console.log("✅ Dummy admin account created successfully!");
        console.log("Email:", adminEmail);
        console.log("Password:", adminPassword);

        process.exit(0);
    } catch (error) {
        console.error("❌ Seed error:", error.message);
        process.exit(1);
    }
};

seedAdmin();
