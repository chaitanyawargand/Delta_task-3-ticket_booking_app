const Booking=require('../modals/bookingschema');
const Event=require('../modals/eventschema');
const AppError=require('./apperror');
const catchAsync=require('./catchAsynch');

module.exports=catchAsync(async(req,res, next)=>{
  const booking=await Booking.findById(req.params.id);
  if (!booking)return next(new AppError('Booking not found',404));
  const userId=req.user.id;
  if (req.user.role==='admin') return next();
  if (req.user.role==='user'&&booking.user.toString()===userId) return next();
  if (req.user.role==='vendor'){
    const event=await Event.findById(booking.event);
    if (!event) return next(new AppError('Associated event not found', 404));
    if (event.vendor.toString()===userId) return next();
  }
  return next(new AppError('You are not authorized to access this booking',403));
});

