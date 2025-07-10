const express= require('express');
const eventController=require('./../controllers/eventcontroller');
const authController=require('./../controllers/authcontroller');
const restrictToOwner=require('./../utils/restrictToOwner');
const event = require('./../modals/eventschema');
const router = express.Router();
const bookingRouter = require('./bookingroutes');
// nested routes 
router.use('/:eventId/bookings', bookingRouter);
// public
router.get('/',eventController.getAllEvents);
router.use(authController.protect);

router
  .route('/')
  .get(eventController.getAllEvents)
  .post(authController.restrictTo('admin','vendor'),eventController.setUserId,eventController.createEvent);

// events created by vendor
router.get('/myEvents', authController.restrictTo('vendor'), eventController.getMyEvents);

router
  .route('/:id')
  .patch(authController.restrictTo('vendor'),(req,res,next)=>{
    if(req.user.role=='vendor') return restrictToOwner(event,'vendor');
    else
    next();},eventController.updateEvent)
  .delete(authController.restrictTo('vendor'),(req,res,next)=>{
    if(req.user.role=='vendor') return restrictToOwner(event,'vendor');
    else next();}, eventController.deleteEvent);

  module.exports=router;