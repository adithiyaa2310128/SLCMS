const Announcement = require("../models/Announcement");

exports.getAllAnnouncements = async (req, res) => {
  try {
    const { type, targetAudience } = req.query;
    const filter = { isActive: true };
    if (type) filter.type = type;
    if (targetAudience) filter.targetAudience = { $in: [targetAudience, "All"] };
    const announcements = await Announcement.find(filter)
      .sort({ isPinned: -1, createdAt: -1 });
    res.json(announcements);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.status(201).json(announcement);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const a = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!a) return res.status(404).json({ message: "Announcement not found" });
    res.json(a);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Announcement deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
