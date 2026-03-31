const Lead = require("../models/Lead");

// GET all leads
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST create lead
exports.createLead = async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json(lead);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

// PUT update lead
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

// DELETE lead
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json({ message: "Lead deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET leads summary stats
exports.getLeadStats = async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const byStatus = await Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const bySource = await Lead.aggregate([
      { $group: { _id: "$source", count: { $sum: 1 } } }
    ]);
    const enrolled = byStatus.find(s => s._id === "Enrolled")?.count || 0;
    const conversionRate = total > 0 ? Math.round((enrolled / total) * 100) : 0;
    res.json({ total, byStatus, bySource, conversionRate });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
