const Hostel = require("../models/Hostel");

exports.getAllHostel = async (req, res) => {
  try {
    const { block, status } = req.query;
    const filter = {};
    if (block) filter.block = block;
    if (status) filter.status = status;
    const records = await Hostel.find(filter).sort({ block: 1, roomNumber: 1 });
    res.json(records);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.assignRoom = async (req, res) => {
  try {
    const hostel = new Hostel(req.body);
    await hostel.save();
    res.status(201).json(hostel);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hostel) return res.status(404).json({ message: "Record not found" });
    res.json(hostel);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteHostel = async (req, res) => {
  try {
    await Hostel.findByIdAndDelete(req.params.id);
    res.json({ message: "Record deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getHostelStats = async (req, res) => {
  try {
    const total = await Hostel.countDocuments({ status: "Active" });
    const byBlock = await Hostel.aggregate([
      { $match: { status: "Active" } },
      { $group: { _id: "$block", count: { $sum: 1 } } }
    ]);
    res.json({ totalOccupied: total, byBlock });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
