const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, ref: "Student" },
    studentName: { type: String, default: "" },
    courseCode: { type: String, required: true },
    courseName: { type: String, default: "" },
    department: { type: String, default: "" },
    semester: { type: Number, required: true },
    type: {
      type: String,
      enum: ["Internal-1", "Internal-2", "Mid-Sem", "End-Sem", "Practical", "Assignment"],
      default: "Internal-1"
    },
    maxMarks: { type: Number, required: true, default: 100 },
    obtainedMarks: { type: Number, required: true, default: 0 },
    grade: { type: String, default: "" },
    gradePoints: { type: Number, default: 0 },
    examDate: { type: Date, default: null },
    remarks: { type: String, default: "" }
  },
  { timestamps: true }
);

// Auto-calculate grade and grade points
examSchema.pre("save", function () {
  const percentage = this.maxMarks > 0 ? (this.obtainedMarks / this.maxMarks) * 100 : 0;
  if (percentage >= 90) { this.grade = "O"; this.gradePoints = 10; }
  else if (percentage >= 80) { this.grade = "A+"; this.gradePoints = 9; }
  else if (percentage >= 70) { this.grade = "A"; this.gradePoints = 8; }
  else if (percentage >= 60) { this.grade = "B+"; this.gradePoints = 7; }
  else if (percentage >= 50) { this.grade = "B"; this.gradePoints = 6; }
  else if (percentage >= 40) { this.grade = "C"; this.gradePoints = 5; }
  else { this.grade = "F"; this.gradePoints = 0; }
});

module.exports = mongoose.model("Exam", examSchema);
