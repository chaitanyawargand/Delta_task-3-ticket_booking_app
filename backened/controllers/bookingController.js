const booking= require('./../modals/bookingschema');
const catchAsync= require('./../utils/catchAsynch');
const AppError= require('./../utils/apperror');
const User= require('./../modals/userschema')
const {event} = require('../modals/eventschema');
const Factory= require('./../controllers/handlerFactory')
const APIFeatures= require('./../utils/apiFeatures')

exports.bookEvent = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.event) req.body.event = req.params.eventId;
  if (!req.body.user) req.body.user = req.user.id;
  const Event = await event.findById(req.body.event);
  if (!Event) return next(new AppError('No event found', 404));
  if (req.body.seats <= 0) {
    return next(new AppError('Invalid number of seats', 400));
  }
  if (event.seatsAvailable < req.body.seats) {
    return next(new AppError('Not enough seats available', 400));
  }
  const totalPrice = Event.price * req.body.seats;
  const user = await User.findById(req.body.user);
  if (!user) return next(new AppError('User not found', 404));
  if (user.balance < totalPrice) {
    return next(new AppError('Not enough money in balance', 400));
  }
  const vendor = await User.findById(Event.vendor);
  if (!vendor) return next(new AppError('Vendor not found', 404));

  user.balance -= totalPrice;
  vendor.balance += totalPrice;
    await user.save({ validateBeforeSave:false });
   await vendor.save({ validateBeforeSave:false });
  Event.seatsAvailable -= req.body.seats;
  await Event.save();
  const bookingData = {
    user: user._id,
    event: Event._id,
    name:Event.name,
    seats: req.body.seats,
    price: totalPrice,
    eventType: Event.type
  };
  if (Event.type === 'train') {
    bookingData.from = Event.from;
    bookingData.to = Event.to;
  } else if (Event.type === 'movie') {
    bookingData.showTime = Event.showTime;
    bookingData.theatre = Event.theatre;
  } else if (Event.type === 'concert') {
    bookingData.venue = Event.venue;
    bookingData.artist =Event.artist;
  }
  // 9. Create booking
  const Booking = await booking.create(bookingData);
  // 10. Send response
  res.status(201).json({
    status: 'success',
    data: { Booking }
  });
});


exports.getMybooking=Factory.getAll(booking,req => ({ user: req.user.id }));

exports.getMyEventBooking= catchAsync(async(req,res,next)=>{
     const myEvents=await event.find({vendor:req.user.id});
     if(!myEvents) return next(new AppError('You have not created any Event',404));
     const eventIds=myEvents.map(e=>e._id);
     const features=new APIFeatures(
     booking.find({event:{$in:eventIds}}),req.query).filter().search().sort();
    const allBookings = await features.query.populate({path: 'user',select: 'name email'})
     .populate({path: 'event',select: 'name type date' });;

    if(!allBookings) return next(new AppError('No bookings have been made for your events'),404)
    res.status(200).json({
    status: 'success',
    results: allBookings.length,
    allBookings
  });
})
exports.cancleBook= catchAsync(async(req,res,next)=>{
   const Booking= await booking.findById(req.params.id);
  if(!Booking) return next(new AppError('No booking found',404));
   const now= Date.now();
  const Event= await event.findById(Booking.event);
  if(new Date(Event.date)> now) {
    const user= await User.findById(Booking.user);
    user.balance+=Booking.price;
    const vendor=await User.findById(Event.vendor);
    vendor.balance-=Booking.price;
    await vendor.save({ validateBeforeSave: false });
    await user.save({ validateBeforeSave: false });

    Event.seatsAvailable+=Booking.seats;
    await Event.save();
    await Booking.deleteOne();
    return res.status(200).json({
      status: 'success',
      message: 'Booking cancelled successfully',
    });
  }  return next(new AppError('You can not cancel booking after the event date',400));
})
exports.getBookingById=catchAsync(async (req,res,next)=>{
  const Booking=await booking.findById(req.params.id).populate({path:'event',select:'name type date vendor'})
  .populate({path:'user',select:'name email'});

  if(!Booking) return next(new AppError('Booking not found', 404));
  res.status(200).json({
    status: 'success',
    data: {
      Booking,
    }
  });
});
