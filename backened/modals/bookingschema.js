const mongoose= require("mongoose")
const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: true
  },
  seats: {
    type: Number,
    required: [true, 'Number of seats is required'],
  },
  price: {
  type: Number,
  required: true,
  immutable: true
 },
   eventType: {
    type: String,
    enum: ['movie', 'concert', 'train'],
    required: true
  },
  // train specific
  from: {
    type: String
  },
  to: {
    type: String
  },
  // movie specific
  showTime: {
    type: String
  },
  theatre: {
    type: String
  },

  //Concert specific
  venue: {
    type: String
  },
  artist: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;