const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/slcms';
console.log('Testing connection to:', uri);

mongoose.connect(uri)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Failed:', err.message);
        process.exit(1);
    });
