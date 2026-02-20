const Alumni = require("../models/Alumni");

// 📥 GET ALL ALUMNI (with optional company filter)
exports.getAlumni = async (req, res) => {
    try {
        const { company } = req.query;
        let query = {};

        if (company) {
            query.company = { $regex: company, $options: "i" };
        }

        const alumni = await Alumni.find(query).sort({ createdAt: -1 });
        res.status(200).json(alumni);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch alumni", error: error.message });
    }
};

// 📥 GET ALUMNI BY ID
exports.getAlumniById = async (req, res) => {
    try {
        const alumni = await Alumni.findById(req.params.id);
        if (!alumni) {
            return res.status(404).json({ message: "Alumni not found" });
        }
        res.status(200).json(alumni);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch alumni", error: error.message });
    }
};

// ➕ CREATE ALUMNI
exports.createAlumni = async (req, res) => {
    try {
        const alumni = new Alumni(req.body);
        await alumni.save();
        res.status(201).json(alumni);
    } catch (error) {
        res.status(500).json({ message: "Failed to create alumni", error: error.message });
    }
};

// ✏️ UPDATE ALUMNI
exports.updateAlumni = async (req, res) => {
    try {
        const alumni = await Alumni.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!alumni) {
            return res.status(404).json({ message: "Alumni not found" });
        }
        res.status(200).json(alumni);
    } catch (error) {
        res.status(500).json({ message: "Failed to update alumni", error: error.message });
    }
};

// 🗑️ DELETE ALUMNI
exports.deleteAlumni = async (req, res) => {
    try {
        const alumni = await Alumni.findByIdAndDelete(req.params.id);
        if (!alumni) {
            return res.status(404).json({ message: "Alumni not found" });
        }
        res.status(200).json({ message: "Alumni deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete alumni", error: error.message });
    }
};
