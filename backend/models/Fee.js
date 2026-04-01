const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    studentName: { type: String, default: "" },
    department: { type: String, default: "" },
    feeType: {
      type: String,
      enum: ["Tuition", "Hostel", "Transport", "Library", "Lab", "Exam", "Development", "Other"],
      required: true
    },
    amount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    fine: { type: Number, default: 0 },
    netAmount: { type: Number, default: 0 },
    dueDate: { type: Date, required: true },
    paidDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Overdue", "Waived"],
      default: "Pending"
    },
    paymentMode: {
      type: String,
      enum: ["Online", "Cash", "DD", "Cheque", "UPI", ""],
      default: ""
    },
    receiptNumber: { type: String, default: "" },
    semester: { type: Number, default: 1 },
    academicYear: { type: String, default: "" },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

feeSchema.pre("save", function () {
  this.netAmount = Math.max(0, this.amount - this.discount + this.fine);

  // Auto-mark overdue
  if (this.status === "Pending" && this.dueDate && new Date() > this.dueDate) {
    this.status = "Overdue";
    this.fine = Math.max(this.fine, Math.round(this.amount * 0.02)); // 2% fine
    this.netAmount = Math.max(0, this.amount - this.discount + this.fine);
  }

  // Generate receipt number on payment
  if (this.status === "Paid" && !this.receiptNumber) {
    this.receiptNumber = `RCP-${Date.now()}`;
  }
});

module.exports = mongoose.model("Fee", feeSchema);
