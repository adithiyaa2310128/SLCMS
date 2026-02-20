const Marks = require("../models/Marks");
const Student = require("../models/Student");
const { updateStudentIntelligence } = require("../services/studentIntelligence");

// ➕ Add marks
exports.addMarks = async (req, res) => {
  try {
    const { studentId, subject, marks } = req.body;

    // 1️⃣ Save marks
    await Marks.create({
      studentId,
      subject,
      marks
    });

    // 2️⃣ Fetch all marks of the student
    const allMarks = await Marks.find({ studentId });

    if (allMarks.length === 0) {
      return res.status(400).json({ message: "No marks found" });
    }

    // 3️⃣ Calculate average marks
    const total = allMarks.reduce((sum, m) => sum + m.marks, 0);
    const average = total / allMarks.length;

    // 4️⃣ GPA calculation (out of 10)
    const gpa = Math.round((average / 10) * 10) / 10;

    // 5️⃣ Update GPA in Student
    await Student.findByIdAndUpdate(studentId, { gpa });

    // 6️⃣ Update intelligence (risk, lifecycle, placement, index)
    await updateStudentIntelligence(studentId);

    res.status(201).json({
      message: "Marks added successfully",
      gpa
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📥 Get marks by student
exports.getMarksByStudent = async (req, res) => {
  try {
    const marks = await Marks.find({
      studentId: req.params.studentId
    });

    res.status(200).json(marks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
