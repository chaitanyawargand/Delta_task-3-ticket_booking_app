const mongoose = require('mongoose');

const baseOptions={
  discriminatorKey:'type',
  collection:'events',
};

const EventSchema=new mongoose.Schema({
  name: {
    type:String,
    require:[true,'event name require']
  },
  date:{
    type:Date,
    require:[true,'event time require']
  },
  price: {
    type:Number,
    requie:[true,"price of event require"]
  },
  seatsAvailable:{type:Number,
  require:[true,'seats available for booking require']
  },
  vendor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
},baseOptions);

const event=mongoose.model('Event', EventSchema);

// Movie Event
const MovieEvent = event.discriminator('movie', new mongoose.Schema({
  theatre: String,
  duration: Number,
  showTime: String
}));

// Train Event
const TrainEvent = event.discriminator('train', new mongoose.Schema({
  from: String,
  to: String,
  trainNumber: String
}));

module.exports = event;
