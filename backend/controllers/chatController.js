const Chat = require('../models/Chat');

const getChatHistory = async (req, res) => {
    try {
        const { room } = req.params;
        const messages = await Chat.find({ room }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getChatHistory };
