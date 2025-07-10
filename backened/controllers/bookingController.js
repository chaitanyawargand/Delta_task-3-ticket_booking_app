const booking= require('./../modals/bookingschema');
const Event= require('./../modals/eventschema');
const catchAsync= require('./../utils/catchAsynch');
const AppError= require('./../utils/apperror');
const User= require('./../modals/userschema')
const Factory= require('./../controllers/handlerFactory')

exports.bookEvent = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.event) req.body.event = req.params.eventId;
  if (!req.body.user) req.body.user = req.user.id;

  // 1. Check if Event Exists
  const event = await Event.findById(req.body.event);
  if (!event) return next(new AppError('No event found', 404));

  // 2. Validate number of seats
  if (req.body.seats <= 0) {
    return next(new AppError('Invalid number of seats', 400));
  }

  // 3. Check seats available
  if (event.seatsAvailable < req.body.seats) {
    return next(new AppError('Not enough seats available', 400));
  }

  // 4. Calculate total price
  const totalPrice = event.price * req.body.seats;

  // 5. Get user and validate balance
  const user = await User.findById(req.body.user);
  if (!user) return next(new AppError('User not found', 404));

  if (user.balance < totalPrice) {
    return next(new AppError('Not enough money in balance', 400));
  }

  // 6. Get vendor and update balances
  const vendor = await User.findById(event.vendor);
  if (!vendor) return next(new AppError('Vendor not found', 404));

  user.balance -= totalPrice;
  vendor.balance += totalPrice;

  await user.save();
  await vendor.save();

  // 7. Update event seats
  event.seatsAvailable -= req.body.seats;
  await event.save();

  // 8. Prepare booking data
  const bookingData = {
    user: user._id,
    event: event._id,
    seats: req.body.seats,
    price: totalPrice,
    eventType: event.type
  };

  if (event.type === 'train') {
    bookingData.from = event.from;
    bookingData.to = event.to;
  } else if (event.type === 'movie') {
    bookingData.showTime = event.showTime;
    bookingData.theatre = event.theatre;
  } else if (event.type === 'concert') {
    bookingData.venue = event.venue;
    bookingData.artist = event.artist;
  }

  // 9. Create booking
  const booking = await Booking.create(bookingData);

  // 10. Send response
  res.status(201).json({
    status: 'success',
    data: { booking }
  });
});


exports.getMybooking=Factory.getAll(booking,req => ({ user: req.user.id }));

exports.getMyEventBooking= catchAsync(async(req,res,next)=>{
     const myEvents=await Event.find({vendor:req.user.id});
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
  const event= await Event.findById(Booking.event);
  if(new Date(event.date)> now) {
    const user= await User.findById(Booking.user);
    user.balance+=Booking.price;
    const vendor=await User.findById(event.vendor);
    vendor.balance-=Booking.price;
    await vendor.save();
    await user.save();
    event.seatsAvailable+=Booking.seats;
    await event.save();
    await Booking.remove();
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


