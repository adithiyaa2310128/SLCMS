const Placement = require("../models/Placement");

exports.getAllPlacements = async (req, res) => {
  try {
    const { studentId, status, type } = req.query;
    const filter = {};
    if (studentId) filter.studentId = studentId;
    if (status) filter.status = status;
    if (type) filter.type = type;
    const placements = await Placement.find(filter).sort({ createdAt: -1 });
    res.json(placements);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createPlacement = async (req, res) => {
  try {
    const placement = new Placement(req.body);
    await placement.save();
    res.status(201).json(placement);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updatePlacement = async (req, res) => {
  try {
    const placement = await Placement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!placement) return res.status(404).json({ message: "Placement record not found" });
    res.json(placement);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deletePlacement = async (req, res) => {
  try {
    await Placement.findByIdAndDelete(req.params.id);
    res.json({ message: "Placement record deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getPlacementStats = async (req, res) => {
  try {
    const totalDrives = await Placement.distinct("companyName");
    const selected = await Placement.countDocuments({ status: "Selected" });
    const totalStudents = await Placement.distinct("studentId");
    const placedStudents = await Placement.distinct("studentId", { status: "Selected" });

    const avgCTC = await Placement.aggregate([
      { $match: { status: "Selected", type: "Full-Time", ctc: { $gt: 0 } } },
      { $group: { _id: null, avg: { $avg: "$ctc" } } }
    ]);

    const byStatus = await Placement.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const byDept = await Placement.aggregate([
      { $match: { status: "Selected" } },
      { $group: { _id: "$department", count: { $sum: 1 } } }
    ]);

    res.json({
      totalDrives: totalDrives.length,
      totalOffers: selected,
      totalStudentsApplied: totalStudents.length,
      studentsPlaced: placedStudents.length,
      placementRate: totalStudents.length > 0 ? Math.round((placedStudents.length / totalStudents.length) * 100) : 0,
      avgCTC: Math.round((avgCTC[0]?.avg || 0) * 10) / 10,
      byStatus,
      byDept
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
