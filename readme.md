# Natours

Natours is a RESTful API and server-side rendered web app built with Node.js, Express, and Pug. It follows best practices for security, authentication, and database management using MongoDB.

## Live Demo

[View Live](https://natours-production-e277.up.railway.app/)

## Switch to "railway-deployment" branch

[Railway-Deployment](https://github.com/AhmedNadeemGondal/natours/tree/railway-deployment)

## Features

- Secure authentication & authorization (JWT, bcryptjs)
- RESTful API with CRUD operations
- Server-side rendering using Pug
- Image processing with Sharp
- Secure HTTP headers with Helmet
- Rate limiting, data sanitization, and CORS handling
- Payment integration with Stripe

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Security**: Helmet, XSS-Clean, Rate Limiting, Express Mongo Sanitize, HPP
- **Authentication**: JWT, bcryptjs, Cookie-parser
- **Frontend**: Pug, ESBuild for JS bundling
- **Utilities**: Nodemailer, Multer, Sharp, Slugify, Validator

## Installation

```sh
# Install dependencies
npm install

# Create a .env file and add required environment variables

# Start the development server
npm run dev
```

## Scripts

- `npm start` - Start in production mode
- `npm run dev` - Start in development mode with Nodemon
- `npm run build:js` - Bundle and minify frontend JS
- `npm run watch:js` - Watch and rebuild frontend JS

## Author

Ahmed Nadeem Gondal
