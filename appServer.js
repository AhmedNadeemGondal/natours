const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit').default;
const helmet = require('helmet').default;
const xss = require('xss-clean');
const ExpressMongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrHand = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL Middlewares
app.use(cors());
app.options('*', cors());
// g) Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// a) SET Security HTTP headers
app.use(helmet());

app.use((req, res, next) => {
  const nonce = Buffer.from(crypto.randomBytes(16)).toString('base64');
  res.setHeader(
    'Content-Security-Policy',
    `script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://js.stripe.com/v3/;`,
  );
  // res.locals.nonce = nonce; // Pass nonce to templates if needed
  next();
});

// b) Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// c) Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour',
});
app.use('/api', limiter);

// d) Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
// e) Data sanitization against NOSQL Query Injection
app.use(ExpressMongoSanitize());

// f) Data sanitization against XSS
app.use(xss()); // Ask someone

// h) Clear query string
app.use(
  hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'ratingsQuantity',
      'ratingsAverage',
      'difficulty',
      'price',
    ],
  }),
); // Ask someone

app.use(compression());

// h) Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) Routes
// a) View Routes
app.use('/', viewRouter);
// b) API Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find '${req.originalUrl}'`, 404));
});

app.use(globalErrHand);

module.exports = app;
