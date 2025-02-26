const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const Review = require('../../models/reviewModel');
const User = require('../../models/userModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours.json', 'utf-8'),
);
const users = JSON.parse(
  fs.readFileSync('./dev-data/data/users.json', 'utf-8'),
);
const reviews = JSON.parse(
  fs.readFileSync('./dev-data/data/reviews.json', 'utf-8'),
);

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    // console.log('Data loaded to DB');
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const delData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('All data deleted from DB');
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connected');

    // Check the command-line arguments and call the respective function
    if (process.argv[2] === '--import') {
      importData();
    } else if (process.argv[2] === '--delete') {
      delData();
    }
  })
  .catch((err) => console.error('DB connection error:', err));

console.log(process.argv);
