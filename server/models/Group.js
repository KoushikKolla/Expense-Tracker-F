const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    groupName: { type: String, required: true, unique: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Group", groupSchema); 