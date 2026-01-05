const express = require('express');
const router = express.Router();
const path = require('path');

// Serve login page
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/views/login.html'));
});

// Serve signup page
router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/views/signup.html'));
});

// Serve dashboard
router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/views/dashboard.html'));
});

// Serve marketplace
router.get('/marketplace', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/views/marketplace.html'));
});

// Serve IoT dashboard
router.get('/iot', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/views/iot.html'));
});

// Serve crop advisory
router.get('/crop-advisory', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/views/crop-advisory.html'));
});

// Serve labour pages
router.get('/labour', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/views/labour.html'));
});

// Serve tools page
router.get('/tools', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/views/tools.html'));
});

// Serve services page
router.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/views/services.html'));
});

// Serve government schemes page
router.get('/schemes', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/views/schemes.html'));
});

// Serve livestock page
router.get('/livestock', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/views/livestock.html'));
});

// Serve admin dashboard
router.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/views/admin.html'));
});

module.exports = router;