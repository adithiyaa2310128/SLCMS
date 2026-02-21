const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Student = require('./models/Student');

const checkDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const raw = await Student.collection.findOne({ name: /Avinash/i });
        console.log("Raw Avinash _id:", raw._id, typeof raw._id, raw._id.constructor.name);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkDb();
