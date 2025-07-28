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
const path = require('path');

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
// Serve static files with CORS headers
app.use('/images', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
}, express.static(path.join(__dirname, 'public/images')));
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', userroutes);
app.use('/events', eventroutes);
app.use('/bookings', bookingroutes);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
