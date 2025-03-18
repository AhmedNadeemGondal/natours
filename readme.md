# Natours

Natours is a RESTful API and server-side rendered web app built with Node.js, Express, and Pug. It follows best practices for security, authentication, and database management using MongoDB.

## API Docs

[Natours API Postman Docs](https://documenter.getpostman.com/view/40971390/2sAYX8J1r5#4f3402aa-801f-4bf7-b9eb-9b65b91324a3)

## Live Demo (Frontend)

[View Live Railway Deployment](https://natours-production-e277.up.railway.app/)
[View Live Vercel Deployment](https://natours-rho-ten.vercel.app/)

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
