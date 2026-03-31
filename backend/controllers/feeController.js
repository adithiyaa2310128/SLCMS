const Fee = require("../models/Fee");

exports.getAllFees = async (req, res) => {
  try {
    const { studentId, status, feeType } = req.query;
    const filter = {};
    if (studentId) filter.studentId = studentId;
    if (status) filter.status = status;
    if (feeType) filter.feeType = feeType;
    const fees = await Fee.find(filter).sort({ dueDate: 1 });
    res.json(fees);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createFee = async (req, res) => {
  try {
    const fee = new Fee(req.body);
    await fee.save();
    res.status(201).json(fee);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.recordPayment = async (req, res) => {
  try {
    const { paymentMode } = req.body;
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    fee.status = "Paid";
    fee.paidDate = new Date();
    fee.paymentMode = paymentMode || "Online";
    await fee.save();
    res.json(fee);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!fee) return res.status(404).json({ message: "Fee record not found" });
    res.json(fee);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteFee = async (req, res) => {
  try {
    await Fee.findByIdAndDelete(req.params.id);
    res.json({ message: "Fee record deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getFeeStats = async (req, res) => {
  try {
    const total = await Fee.aggregate([{ $group: { _id: null, total: { $sum: "$netAmount" } } }]);
    const paid = await Fee.aggregate([
      { $match: { status: "Paid" } },
      { $group: { _id: null, total: { $sum: "$netAmount" } } }
    ]);
    const overdue = await Fee.aggregate([
      { $match: { status: "Overdue" } },
      { $group: { _id: null, total: { $sum: "$netAmount" }, count: { $sum: 1 } } }
    ]);
    const byType = await Fee.aggregate([
      { $group: { _id: "$feeType", total: { $sum: "$netAmount" }, count: { $sum: 1 } } }
    ]);
    res.json({
      totalDue: total[0]?.total || 0,
      totalPaid: paid[0]?.total || 0,
      overdueAmount: overdue[0]?.total || 0,
      overdueCount: overdue[0]?.count || 0,
      byType
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
