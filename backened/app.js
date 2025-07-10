const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const userroutes=require('./routes/userroutes');
const AppError= require('./utils/apperror')
const globalErrorHandler=require('./controllers/errorcontroller')
const eventroutes=require('./routes/eventroutes')
const bookingroutes=require('./routes/bookingroutes')
const app = express();

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

// Data sanitization
app.use(mongoSanitize());
app.use(xss());

// routes
app.use('/api/v1/users', userroutes);
app.use('/api/v1/events', eventroutes);
app.use('/api/v1/bookings', bookingroutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

console.log('✅ App.js loaded');

module.exports = app;