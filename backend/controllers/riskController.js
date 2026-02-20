const Student = require("../models/Student");

const getAtRiskStudents = async (req, res) => {
  try {
    const students = await Student.find({ riskStatus: "At Risk" });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAtRiskStudents };
