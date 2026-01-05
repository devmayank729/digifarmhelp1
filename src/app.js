const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

console.log('🚀 Starting DigiFarmHelp Server...');
console.time('Server Startup');

dotenv.config();

console.log('🔧 Loading environment variables...');

// Connect to database FIRST
connectDB().then(() => {
  console.log('✅ Database connection established');

  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware - minimal
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Static files - simplified
  app.use(express.static('public'));

  // Routes
  try {
    console.log('📡 Setting up routes...');
    app.use('/api', require('./routes/apiRoutes'));
    console.log('✅ API routes loaded');
    app.use('/', require('./routes/viewRoutes'));
    console.log('✅ View routes loaded');
  } catch (routeError) {
    console.error('❌ Route loading error:', routeError.message);
    console.error(routeError.stack);
    process.exit(1);
  }

  // Serve index.html at root
  app.get('/', (req, res) => {
    try {
      res.sendFile(path.join(__dirname, '../public/views/index.html'));
    } catch (error) {
      console.error('❌ Error serving index.html:', error.message);
      res.status(500).send('Server error');
    }
  });

  // Add a simple test endpoint
  app.get('/test', (req, res) => {
    res.send('Server is running at ' + new Date());
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error('❌ Global error:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.error('❌ Unhandled Rejection:', err.message);
    console.error('Stack:', err.stack);
    // Don't exit the process, just log the error
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    console.error('Stack:', err.stack);
    // process.exit(1); // Temporarily commented out for debugging
  });

  // Start server
  try {
    const server = app.listen(PORT, () => {
      console.timeEnd('Server Startup');
      console.log(`🎉 Server running on http://localhost:${PORT}`);
      console.log(`🌐 Access your app at: http://localhost:${PORT}`);
    });

    // Keep alive
    setInterval(() => {
      console.log('Server is running...');
    }, 30000); // Log every 30 seconds to keep alive

  } catch (listenError) {
    console.error('❌ Failed to start server on port', PORT, listenError.message);
    process.exit(1);
  }

}).catch((error) => {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
});