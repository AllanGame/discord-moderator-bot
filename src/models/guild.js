const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
    guildID: String,
    prefix: String,
    mutedRole: Number,
    modlogs: String
});

module.exports = mongoose.model("Guild", guildSchema);