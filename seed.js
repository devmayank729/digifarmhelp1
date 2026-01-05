const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const MarketplaceItem = require('./src/models/MarketplaceItem');
const IoTDevice = require('./src/models/IoTDevice');
const FarmerProfile = require('./src/models/FarmerProfile');
const Crop = require('./src/models/Crop');
const Labour = require('./src/models/Labour');
const LabourAgency = require('./src/models/LabourAgency');
const Tool = require('./src/models/Tool');
const Service = require('./src/models/Service');
const GovtScheme = require('./src/models/GovtScheme');
const Livestock = require('./src/models/Livestock');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding');

    // Drop collections to avoid index issues
    await mongoose.connection.db.dropCollection('users').catch(() => {});
    await mongoose.connection.db.dropCollection('marketplaceitems').catch(() => {});
    await mongoose.connection.db.dropCollection('iotdevices').catch(() => {});
    await mongoose.connection.db.dropCollection('farmerprofiles').catch(() => {});
    await mongoose.connection.db.dropCollection('crops').catch(() => {});
    await mongoose.connection.db.dropCollection('labours').catch(() => {});
    await mongoose.connection.db.dropCollection('labouragencies').catch(() => {});
    await mongoose.connection.db.dropCollection('tools').catch(() => {});
    await mongoose.connection.db.dropCollection('services').catch(() => {});
    await mongoose.connection.db.dropCollection('govtschemes').catch(() => {});
    await mongoose.connection.db.dropCollection('livestocks').catch(() => {});

    // Clear existing data
    await User.deleteMany();
    await MarketplaceItem.deleteMany();
    await IoTDevice.deleteMany();
    await FarmerProfile.deleteMany();
    await Crop.deleteMany();
    await Labour.deleteMany();
    await LabourAgency.deleteMany();
    await Tool.deleteMany();
    await Service.deleteMany();
    await GovtScheme.deleteMany();
    await Livestock.deleteMany();

    // Create sample users
    const users = await User.create([
      {
        name: 'Ramesh Kumar',
        email: 'ramesh@farmer.com',
        password: 'password123',
        role: 'Farmer',
        phone: '9876543210',
        location: 'Punjab',
        district: 'Amritsar',
        state: 'Punjab',
      },
      {
        name: 'Suresh Patel',
        email: 'suresh@farmer.com',
        password: 'password123',
        role: 'Farmer',
        phone: '9876543211',
        location: 'Gujarat',
        district: 'Ahmedabad',
        state: 'Gujarat',
      },
      {
        name: 'Priya Sharma',
        email: 'priya@labour.com',
        password: 'password123',
        role: 'Labour Agency',
        phone: '9876543212',
        location: 'Haryana',
        district: 'Gurgaon',
        state: 'Haryana',
      },
      {
        name: 'Rajesh Tools',
        email: 'rajesh@tools.com',
        password: 'password123',
        role: 'Tool/Service Provider',
        phone: '9876543213',
        location: 'Maharashtra',
        district: 'Pune',
        state: 'Maharashtra',
      },
      {
        name: 'Admin User',
        email: 'admin@digifarm.com',
        password: 'admin123',
        role: 'Admin',
        phone: '9876543214',
        location: 'Delhi',
        district: 'New Delhi',
        state: 'Delhi',
      },
    ]);

    console.log('Users created:', users.length);

    // Create sample marketplace items
    const marketplaceItems = await MarketplaceItem.create([
      {
        title: 'Premium Wheat Seeds',
        description: 'High-yield wheat seeds suitable for Rabi season in Punjab',
        price: 2500,
        category: 'Seeds',
        sellerId: users[0]._id,
      },
      {
        title: 'Organic Fertilizer',
        description: 'Natural fertilizer for better crop growth',
        price: 1200,
        category: 'Tools',
        sellerId: users[1]._id,
      },
      {
        title: 'Jersey Cow',
        description: 'Healthy milking cow from Karnataka',
        price: 85000,
        category: 'Livestock',
        sellerId: users[0]._id,
        milkCapacity: 15,
        lactationStage: 3,
      },
      {
        title: 'Rice Seeds',
        description: 'Kharif season rice seeds',
        price: 1800,
        category: 'Seeds',
        sellerId: users[1]._id,
      },
      {
        title: 'Buffalo',
        description: 'High milk yield buffalo',
        price: 95000,
        category: 'Livestock',
        sellerId: users[1]._id,
        milkCapacity: 20,
        lactationStage: 5,
      },
    ]);

    console.log('Marketplace items created:', marketplaceItems.length);

    // Create sample IoT devices
    const iotDevices = await IoTDevice.create([
      {
        name: 'Farm Pump 1',
        type: 'Pump',
        location: 'Karnataka Field A',
        userId: users[0]._id,
        status: 'Active',
      },
      {
        name: 'Soil Sensor 1',
        type: 'Sensor',
        location: 'Punjab Field B',
        userId: users[1]._id,
        status: 'Active',
      },
      {
        name: 'Weather Monitor',
        type: 'Monitor',
        location: 'Central Station',
        userId: users[0]._id,
        status: 'Active',
      },
    ]);

    console.log('IoT devices created:', iotDevices.length);

    // Create sample farmer profiles
    const farmerProfiles = await FarmerProfile.create([
      {
        userId: users[0]._id,
        location: 'Punjab',
        farmSize: 25, // acres
        soilType: 'Alluvial',
        crops: ['Wheat', 'Rice', 'Cotton'],
        livestock: ['Cow', 'Buffalo'],
      },
      {
        userId: users[1]._id,
        location: 'Gujarat',
        farmSize: 15,
        soilType: 'Black Cotton',
        crops: ['Cotton', 'Groundnut', 'Wheat'],
        livestock: ['Cow'],
      },
    ]);

    console.log('Farmer profiles created:', farmerProfiles.length);

    // Create sample crops
    const crops = await Crop.create([
      {
        name: 'Wheat',
        season: 'Rabi',
        description: 'High-yield wheat variety suitable for northern India',
        soilRequirements: 'Well-drained alluvial soil',
        waterRequirements: 'Moderate irrigation required',
        expectedYield: '4-5 tons per acre',
        marketPrice: 2000,
        regions: ['Punjab', 'Haryana', 'Uttar Pradesh'],
      },
      {
        name: 'Rice',
        season: 'Kharif',
        description: 'Premium basmati rice variety',
        soilRequirements: 'Clay loam soil',
        waterRequirements: 'High water requirement',
        expectedYield: '3-4 tons per acre',
        marketPrice: 3000,
        regions: ['Punjab', 'Haryana', 'Uttarakhand'],
      },
      {
        name: 'Cotton',
        season: 'Kharif',
        description: 'Long staple cotton for textile industry',
        soilRequirements: 'Black cotton soil',
        waterRequirements: 'Moderate water requirement',
        expectedYield: '2-3 tons per acre',
        marketPrice: 5000,
        regions: ['Gujarat', 'Maharashtra', 'Andhra Pradesh'],
      },
    ]);

    console.log('Crops created:', crops.length);

    // Create sample labour
    const labours = await Labour.create([
      {
        userId: users[2]._id,
        name: 'Ram Singh',
        age: 35,
        gender: 'Male',
        skills: ['Ploughing', 'Sowing', 'Harvesting'],
        experience: 12,
        location: 'Haryana',
        contactNumber: '9876543215',
        hourlyRate: 150,
        description: 'Experienced farm worker with tractor operation skills',
      },
    ]);

    console.log('Labour profiles created:', labours.length);

    // Create sample labour agency
    const labourAgencies = await LabourAgency.create([
      {
        userId: users[2]._id,
        agencyName: 'Sharma Labour Agency',
        location: 'Haryana',
        contactNumber: '9876543216',
        email: 'sharma@labour.com',
        services: ['Labour Supply', 'Equipment Rental'],
        description: 'Reliable labour and equipment services for farmers',
      },
    ]);

    console.log('Labour agencies created:', labourAgencies.length);

    // Create sample tools
    const tools = await Tool.create([
      {
        name: 'Mahindra Tractor',
        category: 'Tractor',
        description: '45 HP tractor with all attachments',
        specifications: '45 HP, 4WD, with cultivator and harrow',
        dailyRate: 2500,
        location: 'Maharashtra',
        ownerId: users[3]._id,
        images: ['tractor1.jpg'],
      },
      {
        name: 'Sprayer Machine',
        category: 'Sprayer',
        description: '16-liter capacity pesticide sprayer',
        specifications: '16L capacity, battery operated',
        dailyRate: 500,
        location: 'Maharashtra',
        ownerId: users[3]._id,
        images: ['sprayer1.jpg'],
      },
    ]);

    console.log('Tools created:', tools.length);

    // Create sample services
    const services = await Service.create([
      {
        name: 'Veterinary Services',
        category: 'Veterinary',
        description: 'Complete animal healthcare services',
        providerId: users[3]._id,
        location: 'Maharashtra',
        contactNumber: '9876543217',
        email: 'vet@services.com',
        pricing: '₹300 per visit',
        certifications: ['BVSc & AH'],
      },
      {
        name: 'Soil Testing Lab',
        category: 'Soil Testing',
        description: 'Comprehensive soil analysis and recommendations',
        providerId: users[3]._id,
        location: 'Maharashtra',
        contactNumber: '9876543218',
        email: 'soiltest@services.com',
        pricing: '₹500 per sample',
        certifications: ['ICAR Accredited'],
      },
    ]);

    console.log('Services created:', services.length);

    // Create sample government schemes
    const govtSchemes = await GovtScheme.create([
      {
        name: 'PM Kisan Samman Nidhi',
        description: 'Direct income support to farmers',
        category: 'Subsidy',
        eligibility: 'Small and marginal farmers with landholding up to 2 hectares',
        benefits: '₹6000 per year in three installments',
        applicationProcess: 'Apply through CSC centers or online portal',
        contactInfo: 'PM Kisan helpline: 155261',
        regions: ['All India'],
        createdBy: users[4]._id,
      },
      {
        name: 'Pradhan Mantri Fasal Bima Yojana',
        description: 'Crop insurance scheme',
        category: 'Insurance',
        eligibility: 'All farmers growing notified crops',
        benefits: 'Coverage against crop loss due to natural calamities',
        applicationProcess: 'Apply through banks or CSC centers',
        contactInfo: 'Crop Insurance helpline: 1800-11-7717',
        regions: ['All India'],
        createdBy: users[4]._id,
      },
      {
        name: 'Kisan Credit Card',
        description: 'Credit facility for farmers',
        category: 'Loan',
        eligibility: 'Farmers with landholding',
        benefits: 'Short-term credit up to ₹3 lakh',
        applicationProcess: 'Apply at banks with land documents',
        contactInfo: 'Bank helpline numbers',
        regions: ['All India'],
        createdBy: users[4]._id,
      },
    ]);

    console.log('Government schemes created:', govtSchemes.length);

    // Create sample livestock
    const livestocks = await Livestock.create([
      {
        type: 'Cow',
        breed: 'Jersey',
        age: 48, // months
        weight: 350, // kg
        milkProduction: 18, // liters/day
        lactationCount: 4,
        lactationMonth: 3,
        location: 'Punjab',
        price: 85000,
        description: 'Healthy Jersey cow with good milk yield',
        sellerId: users[0]._id,
        images: ['cow1.jpg'],
      },
      {
        type: 'Buffalo',
        breed: 'Murrah',
        age: 60,
        weight: 450,
        milkProduction: 22,
        lactationCount: 5,
        lactationMonth: 4,
        location: 'Gujarat',
        price: 95000,
        description: 'High-yield Murrah buffalo',
        sellerId: users[1]._id,
        images: ['buffalo1.jpg'],
      },
    ]);

    console.log('Livestock created:', livestocks.length);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();