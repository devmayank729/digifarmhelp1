const express = require('express');
const dotenv = require('dotenv');

console.log('🚀 Starting DigiFarmHelp Server...');
console.time('Server Startup');

dotenv.config();

// Connect to database
const connectDB = require('./config/db');
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
console.log('📡 Setting up routes...');
app.use('/', require('./routes/viewRoutes'));
app.use('/api', require('./routes/apiRoutes'));
console.log('✅ View routes loaded');
console.log('✅ API routes loaded');

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
});