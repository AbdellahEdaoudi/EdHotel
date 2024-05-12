const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: String,
    email: String,
    pass: String,
    created_at: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = User = mongoose.model("user", UserSchema);