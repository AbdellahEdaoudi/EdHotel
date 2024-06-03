const mongoose = require("mongoose");

const AdminSchema = mongoose.Schema({
    name: String,
    email: String,
    pass: String,
    created_at: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = Admin = mongoose.model("Admin", AdminSchema);