const Student = require("../models/Student");
const { updateStudentIntelligence } = require("../services/studentIntelligence");

// ➕ CREATE STUDENT
exports.createStudent = async (req, res) => {
  try {
    // 🛠️ FIX: Auto-generate missing fields for simple frontend forms
    const studentData = {
      ...req.body,
      studentId: req.body.studentId || `STU-${Date.now()}`, // Generate unique ID
      department: req.body.department || "General",        // Default department
      currentSemester: req.body.currentSemester || 1        // Default semester
    };

    const student = new Student(studentData);
    await student.save();

    // 🧠 Dynamic Risk & Intelligence Calculation for the new student
    await updateStudentIntelligence(student._id);

    // Refresh the student to get the updated fields
    const updatedStudent = await Student.findById(student._id);

    res.status(201).json(updatedStudent);
  } catch (err) {
    console.error("Error creating student:", err); // Log error for debugging
    res.status(500).json({
      message: "Failed to create student",
      error: err.message
    });
  }
};

// 📥 GET ALL STUDENTS
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch students",
      error: err.message
    });
  }
};

// 📥 GET STUDENT BY ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch student",
      error: err.message
    });
  }
};

// ✏️ UPDATE STUDENT
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 🧠 Dynamic Risk & Intelligence Calculation after update
    await updateStudentIntelligence(req.params.id);

    // Refresh the student to get the updated fields
    const updatedStudent = await Student.findById(req.params.id);

    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(500).json({
      message: "Failed to update student",
      error: err.message
    });
  }
};

// 🗑️ DELETE STUDENT
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete student",
      error: err.message
    });
  }
};
