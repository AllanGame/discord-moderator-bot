const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
    guildID: String,
    prefix: String,
    sanctions: Number,
    mutedRole: String,
    modlogsChannel: String
});

module.exports = mongoose.model("Guild", guildSchema);
