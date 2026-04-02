const Admission = require("../models/Admission");
const Student = require("../models/Student");

// GET all admissions
exports.getAllAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.json(admissions);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST create application
exports.createAdmission = async (req, res) => {
  try {
    const admission = new Admission({
      ...req.body,
      documents: [
        { name: "ID Proof", uploaded: false },
        { name: "10th Marksheet", uploaded: false },
        { name: "12th Marksheet", uploaded: false },
        { name: "Transfer Certificate", uploaded: false },
        { name: "Photo", uploaded: false }
      ]
    });
    await admission.save();
    res.status(201).json(admission);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

// PUT update application status
exports.updateAdmission = async (req, res) => {
  try {
    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!admission) return res.status(404).json({ message: "Application not found" });
    res.json(admission);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

// POST enroll selected applicant (creates Student record)
exports.enrollApplicant = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ message: "Application not found" });
    if (admission.applicationStatus !== "Selected") {
      return res.status(400).json({ message: "Only selected applicants can be enrolled" });
    }

    const studentId = `STU-${Date.now()}`;
    const student = new Student({
      _id: studentId,
      studentId,
      name: admission.name,
      email: admission.email,
      department: admission.department,
      currentSemester: 1,
      lifecycleStage: "ENROLLED"
    });
    await student.save();

    admission.applicationStatus = "Enrolled";
    admission.studentId = studentId;
    await admission.save();

    res.status(201).json({ message: "Student enrolled successfully", student, admission });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE application
exports.deleteAdmission = async (req, res) => {
  try {
    await Admission.findByIdAndDelete(req.params.id);
    res.json({ message: "Application deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET stats
exports.getAdmissionStats = async (req, res) => {
  try {
    const total = await Admission.countDocuments();
    const byStatus = await Admission.aggregate([
      { $group: { _id: "$applicationStatus", count: { $sum: 1 } } }
    ]);
    const byDept = await Admission.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } }
    ]);
    res.json({ total, byStatus, byDept });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
