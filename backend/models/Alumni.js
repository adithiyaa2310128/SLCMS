const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        company: {
            type: String,
            required: true
        },

        jobRole: {
            type: String,
            required: true
        },

        department: {
            type: String,
            default: "Computer Science"
        },

        batch: {
            type: String,
            required: true
        },

        linkedin: {
            type: String,
            default: ""
        },

        bio: {
            type: String,
            default: ""
        },

        skills: {
            type: [String],
            default: []
        },

        yearsOfExperience: {
            type: Number,
            default: 0
        },

        available: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Alumni", alumniSchema);
