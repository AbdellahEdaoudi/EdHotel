const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  prix: { 
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
}
});



module.exports = Hotel = mongoose.model('hotel', hotelSchema);
