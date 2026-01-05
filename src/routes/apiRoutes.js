const express = require('express');
const router = express.Router();

// Import controllers
const {
  register,
  login,
  getProfile,
} = require('../controllers/authController');

const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/farmController');

const {
  getDevices,
  getDevice,
  createDevice,
  updateDevice,
  deleteDevice,
  toggleDevice,
} = require('../controllers/iotController');

const {
  getCrops,
  getCropById,
  getCropRecommendations,
  createCrop,
  updateCrop,
  deleteCrop,
} = require('../controllers/cropController');

const {
  registerLabour,
  getLabourProfile,
  updateLabourProfile,
  searchLabour,
  registerAgency,
  getAgencyProfile,
  updateAgencyProfile,
  getAgencies,
} = require('../controllers/labourController');

const {
  addTool,
  getMyTools,
  updateTool,
  deleteTool,
  searchTools,
  getToolById,
} = require('../controllers/toolController');

const {
  addService,
  getMyServices,
  updateService,
  deleteService,
  searchServices,
  getServiceById,
} = require('../controllers/serviceController');

const {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
  getSchemesByRegion,
} = require('../controllers/govtSchemeController');

const {
  addLivestock,
  getMyLivestock,
  updateLivestock,
  deleteLivestock,
  searchLivestock,
  getLivestockById,
  markAsSold,
} = require('../controllers/livestockController');

// Import middleware
const { protect, admin, farmerOnly } = require('../middleware/auth');

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/profile', protect, getProfile);

// Marketplace routes
router.route('/marketplace').get(getItems).post(protect, farmerOnly, createItem);
router
  .route('/marketplace/:id')
  .get(getItem)
  .put(protect, farmerOnly, updateItem)
  .delete(protect, farmerOnly, deleteItem);

// IoT routes
router.route('/iot/devices').get(protect, getDevices).post(protect, createDevice);
router
  .route('/iot/devices/:id')
  .get(protect, getDevice)
  .put(protect, updateDevice)
  .delete(protect, deleteDevice);
router.put('/iot/devices/:id/toggle', protect, toggleDevice);

// Crop Advisory routes
router.route('/crops').get(getCrops).post(protect, admin, createCrop);
router.route('/crops/:id').get(getCropById).put(protect, admin, updateCrop).delete(protect, admin, deleteCrop);
router.get('/crops/recommendations', protect, getCropRecommendations);

// Labour routes
router.post('/labour/register', protect, registerLabour);
router.route('/labour/profile').get(protect, getLabourProfile).put(protect, updateLabourProfile);
router.get('/labour/search', searchLabour);

// Labour Agency routes
router.post('/labour/agency/register', protect, registerAgency);
router.route('/labour/agency/profile').get(protect, getAgencyProfile).put(protect, updateAgencyProfile);
router.get('/labour/agencies', getAgencies);

// Tool Rental routes
router.route('/tools').get(searchTools).post(protect, addTool);
router.route('/tools/my').get(protect, getMyTools);
router.route('/tools/:id').get(getToolById).put(protect, updateTool).delete(protect, deleteTool);

// Service routes
router.route('/services').get(searchServices).post(protect, addService);
router.route('/services/my').get(protect, getMyServices);
router.route('/services/:id').get(getServiceById).put(protect, updateService).delete(protect, deleteService);

// Government Schemes routes
router.route('/schemes').get(getSchemes).post(protect, admin, createScheme);
router.route('/schemes/:id').get(getSchemeById).put(protect, admin, updateScheme).delete(protect, admin, deleteScheme);
router.get('/schemes/region/:region', getSchemesByRegion);

// Livestock routes
router.route('/livestock').get(searchLivestock).post(protect, addLivestock);
router.route('/livestock/my').get(protect, getMyLivestock);
router.route('/livestock/:id').get(getLivestockById).put(protect, updateLivestock).delete(protect, deleteLivestock);
router.put('/livestock/:id/sold', protect, markAsSold);

module.exports = router;