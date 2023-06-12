const Message = require("./messages");
const Reaction = require("./reaction");

async function addReaction(req, res) {
  const { messageId, reactionType, userId } = req.body;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    const reaction = await Reaction.create({ type: reactionType, user: userId });
    message.reactions.push(reaction);
    await message.save();

    res.status(200).json({ success: true, reaction });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { addReaction };