const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    nameC: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    nameR: {
        type: String,
        required: true,
        trim: true,
    },
    prix: {
        type: Number,
        required: true,
        trim: true,
    },
    check_in: {
        type: Date,
        required: true,
    },
    check_out: {
        type: Date,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = Booking = mongoose.model('Booking', BookingSchema);
