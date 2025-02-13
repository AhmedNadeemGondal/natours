const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('Uncaught EXCEPTION! 💥');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./appServer');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// Hosted by Atlas
mongoose.connect(DB).then(() => {
  console.log('DB connected');
});

// Local DB
// mongoose
//   .connect(process.env.DATABASE_LOCAL)
//   .then(() => console.log('Local DB connected'));

const port = 3000 || process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App runnig on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled REJECTION! 💥');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
