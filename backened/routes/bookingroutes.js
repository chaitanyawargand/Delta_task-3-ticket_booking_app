const express= require('express')
const bookingController=require('./../controllers/bookingController')
const authController=require('./../controllers/authcontroller')
const restrictToOwner=require('./../utils/restrictToOwner');
const Booking = require('../modals/bookingschema');
const restrictTobooking= require('./../utils/restructtoBooking')
const Router = express.Router({ mergeParams: true });

Router.use(authController.protect);

// /events/:eventId/bookings
Router.post('/',authController.restrictTo('user'),bookingController.bookEvent);

Router.get('/my-bookings',authController.restrictTo('user'),bookingController.getMybooking);

Router.get('/my-events',authController.restrictTo('vendor'),bookingController.getMyEventBooking);

Router.delete('/:id/cancel',authController.restrictTo('user'),restrictToOwner(Booking,'user'),bookingController.cancleBook);

Router.route('/:id')
.get(authController.restrictTo('user','vendor','admin'),restrictTobooking,bookingController.getBookingById)
.delete(authController.restrictTo('user','vendor','admin'),restrictTobooking,bookingController.cancleBook)

module.exports=Router;

