const Exam = require("../models/Exam");
const Student = require("../models/Student");
const { updateStudentIntelligence } = require("../services/studentIntelligence");

exports.getAllExams = async (req, res) => {
  try {
    const { studentId, courseCode, semester } = req.query;
    const filter = {};
    if (studentId) filter.studentId = studentId;
    if (courseCode) filter.courseCode = courseCode;
    if (semester) filter.semester = Number(semester);
    const exams = await Exam.find(filter).sort({ createdAt: -1 });
    res.json(exams);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addExamResult = async (req, res) => {
  try {
    const exam = new Exam(req.body);
    await exam.save();

    // Recompute CGPA for student
    const allExams = await Exam.find({ studentId: exam.studentId });
    if (allExams.length > 0) {
      const totalPoints = allExams.reduce((sum, e) => sum + (e.gradePoints || 0), 0);
      const cgpa = Math.round((totalPoints / allExams.length) * 10) / 10;
      await Student.findOneAndUpdate({ studentId: exam.studentId }, { gpa: cgpa });
      await updateStudentIntelligence(exam.studentId);
    }

    res.status(201).json(exam);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateExamResult = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!exam) return res.status(404).json({ message: "Exam record not found" });
    res.json(exam);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteExamResult = async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: "Exam record deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getStudentCGPA = async (req, res) => {
  try {
    const { studentId } = req.params;
    const exams = await Exam.find({ studentId });
    if (!exams.length) return res.json({ cgpa: 0, totalExams: 0, grades: [] });

    const totalPoints = exams.reduce((sum, e) => sum + (e.gradePoints || 0), 0);
    const cgpa = Math.round((totalPoints / exams.length) * 10) / 10;
    const grades = exams.map(e => ({ course: e.courseCode, grade: e.grade, points: e.gradePoints }));
    res.json({ cgpa, totalExams: exams.length, grades });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
