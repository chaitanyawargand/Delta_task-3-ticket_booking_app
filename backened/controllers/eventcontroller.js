const {event,MovieEvent,TrainEvent,ConcertEvent}=require('../modals/eventschema');
const Factory= require('./../controllers/handlerFactory');
const catchAsynch=require('./../utils/catchAsynch')
const AppError= require('./../utils/apperror')
const Booking=require('./../modals/bookingschema')
const User=require('./../modals/userschema')
const catchAsync= require('./../utils/catchAsynch')

exports.setUserId=(req,res,next)=>{
    if(!req.body.vendor) req.body.vendor=req.user.id;
    next()
}
exports.getAllEvents=Factory.getAll(event,{select: '-__v', populate: {path: 'vendor',select: 'name email'}});
exports.getMyEvents=Factory.getAll(event,req=>({vendor:req.user.id}),{select:'-__v', populate: {path: 'vendor',select: 'name email'}});
exports.getEvent=Factory.getOne(event,{select: '-__v', populate: {path: 'vendor',select: 'name email'}});
exports.updateEvent=Factory.updateOne(event);

exports.deleteEvent= catchAsynch( async(req,res,next)=>{
   const Event=await event.findById(req.params.id);
   if(!Event) return next(new AppError('Event not found',404));
   const now= Date.now();
  const bookings=await Booking.find({event:Event._id });
  for(let booking of bookings){
    if(new Date(Event.date)>now){
    const user=await User.findById(booking.user);
    user.balance+=booking.price;
     await user.save();
     await booking.remove();
    }
  }
   await Event.remove();
   res.status(200).json({
    status: 'success',
    message: 'Event deleted successfully',
  });
})
exports.createEvent = catchAsync(async (req, res, next) => {
  let Model;
  if(req.body.trainNumber || req.body.from || req.body.to) {
    Model=TrainEvent
  } else if(req.body.theatre || req.body.duration || req.body.showTime) {
    Model=MovieEvent;
  } else if(req.body.performer || req.body.venue) {
    Model=ConcertEvent; }
  if (req.user && req.user.id) { req.body.vendor = req.user.id; }
  const newEvent=await Model.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      data: newEvent
    }
  });
});
