const mongoose = require("mongoose");

const sanctionSchema = new mongoose.Schema({
    sanctionID: String,
    staffID: String,
    targetID: String,
    sanctionType: String,
    reason: String,
    time: String,
});

module.exports = mongoose.model("Sanction", sanctionSchema);
