const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

console.log('🚀 Starting DigiFarmHelp Server...');
console.time('Server Startup');

dotenv.config();

// Connect to database FIRST
connectDB().then(() => {
  console.log('✅ Database connection established');

  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware
  // app.use(express.json()); // Temporarily disabled

  // Routes
  console.log('📡 Setting up routes...');
  // app.use('/api', require('./routes/apiRoutes'));
  console.log('✅ API routes skipped for testing');
  // app.use('/', require('./routes/viewRoutes'));
  console.log('✅ View routes skipped for testing');

  // Serve index.html at root
  app.get('/', (req, res) => {
    res.send('DigiFarmHelp Server Running! Access your app at http://localhost:3000');
  });

  app.get('/test', (req, res) => {
    res.send('Server is running at ' + new Date());
  });

  // Start server
  app.listen(PORT, () => {
    console.timeEnd('Server Startup');
    console.log(`🎉 Server running on http://localhost:${PORT}`);
    console.log(`🌐 Access your app at: http://localhost:${PORT}`);
  });

}).catch((error) => {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
});