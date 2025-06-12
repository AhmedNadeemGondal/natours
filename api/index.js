const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('../appServer'); // Your Express app instance

// Load environment variables early
dotenv.config({ path: './config.env' });

// --- MongoDB Connection Management for Serverless ---
// Cache the database connection
let cachedDb = null;

async function connectToDatabase() {
  // If we have a cached connection, return it
  if (cachedDb && mongoose.connection.readyState === 1) {
    // Check readyState to ensure connection is open
    console.log('Using existing database connection');
    return cachedDb;
  }

  // If no connection, or connection is not open, establish a new one
  console.log('Attempting to establish new database connection...');
  try {
    const DB = process.env.DATABASE.replace(
      '<PASSWORD>',
      process.env.DATABASE_PASSWORD,
    );

    const db = await mongoose.connect(DB, {
      // These options are no longer needed in Mongoose v6.0.0+
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // Other recommended options for production (optional for demo):
      // bufferCommands: false, // Disable Mongoose's internal buffering
      // serverSelectionTimeoutMS: 5000, // Keep this relatively low for serverless
    });
    cachedDb = db;
    console.log('DB connected successfully!');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // In serverless, we generally don't want to exit the process on connection failure
    // The function will return an error response, and Vercel might spin up a new instance
    throw error; // Re-throw to be caught by subsequent error handling middleware/routes
  }
}

// --- Global Error Handlers (Adjusted for Serverless) ---
// Do NOT call process.exit() directly in Vercel functions
// It interrupts the lifecycle and can lead to more cold starts.
// Instead, log the error and let the function finish.
process.on('uncaughtException', (err) => {
  console.error(
    'UNCAUGHT EXCEPTION! 💥 Shutting down (gracefully for serverless)...',
  );
  console.error(err.name, err.message, err.stack);
  // In serverless, you cannot reliably "exit" the process as it's managed by the platform.
  // The current invocation will fail, but the instance might be reused.
  // We'll log extensively for debugging.
  // A proper error handling middleware in appServer.js should send an error response.
});

process.on('unhandledRejection', (err) => {
  console.error(
    'UNHANDLED REJECTION! 💥 Shutting down (gracefully for serverless)...',
  );
  console.error(err.name, err.message, err.stack);
  // Similar to uncaughtException, avoid process.exit(1) in serverless.
  // Log the error and rely on the calling code/framework to handle the response.
});

// SIGTERM handling (less critical for serverless, but good practice)
// Vercel manages scaling down instances, so this might not always be explicitly triggered
// by your application, but it's harmless to keep.
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Cleaning up (serverless context)...');
  // In a traditional server, this closes the http server.
  // In Vercel, the function instance is managed by Vercel.
  // You can put any cleanup logic here, but don't assume a graceful HTTP server close
  // like in a long-running server.
  // For MongoDB, if you had a direct client connection *not* managed by Mongoose pooling,
  // you might close it here. Mongoose manages its own pool.
  console.log('Process terminated.');
  // No process.exit(0) here. Vercel terminates the instance when it's done.
});

// --- The main export for Vercel ---
// Instead of app.listen(), you export the Express app instance.
// Vercel wraps this and handles the incoming HTTP requests.
// We'll also call the connectToDatabase function here to ensure
// the connection is attempted during cold starts.

// IMPORTANT: This creates a Vercel-compatible serverless function
// You might need to move this file into an 'api' directory in your project root,
// e.g., 'api/server.js' or 'api/index.js' depending on your Vercel routing setup.
module.exports = async (req, res) => {
  // Connect to DB for every incoming request (connection is cached after first success)
  try {
    await connectToDatabase();
  } catch (dbError) {
    // If DB connection fails, send a 500 error and log, but don't crash the instance.
    console.error('Database connection failed for request:', dbError);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to connect to the database. Please try again later.',
    });
  }

  // Let your Express app handle the request
  // Vercel implicitly passes req and res to your exported Express app.
  app(req, res);
};

// If you had any background tasks or listeners not tied to HTTP requests
// that need to start on cold boot, you'd trigger them here.
// But for a typical Express API, the above export is sufficient.
