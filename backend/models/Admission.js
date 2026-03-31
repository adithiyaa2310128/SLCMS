const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema(
  {
    applicationNumber: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    program: { type: String, required: true },
    department: { type: String, required: true },
    applicationStatus: {
      type: String,
      enum: ["Pending", "Shortlisted", "Selected", "Rejected", "Enrolled"],
      default: "Pending"
    },
    documents: [
      {
        name: String,
        uploaded: { type: Boolean, default: false }
      }
    ],
    entranceScore: { type: Number, default: null },
    interviewDate: { type: Date, default: null },
    interviewScore: { type: Number, default: null },
    meritRank: { type: Number, default: null },
    offerLetterSent: { type: Boolean, default: false },
    feesPaid: { type: Boolean, default: false },
    studentId: { type: String, default: null }, // set after enrollment
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

// Auto-generate application number
admissionSchema.pre("save", async function (next) {
  if (!this.applicationNumber) {
    const count = await mongoose.model("Admission").countDocuments();
    this.applicationNumber = `APP-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Admission", admissionSchema);
