# DigiFarmHelp - Smart Farming Platform for Indian Farmers

A comprehensive, full-stack farming platform built with Node.js, Express, MongoDB, and vanilla JavaScript. Designed specifically for Indian farmers with a farmer-first approach.

## 🌾 Features

### Core Functionality
- **User Authentication**: Secure login/signup with role-based access (Farmer, Labour, Admin)
- **Unified Marketplace**: Buy/sell seeds, tools, and livestock with Indian pricing (₹)
- **IoT Device Management**: Monitor and control farm equipment remotely
- **Smart Pump Simulation**: Real-time telemetry with visual animations
- **Mandi Rates Ticker**: Live crop price updates for informed decisions

### Farmer-Centric Design
- **Big Button UI**: Easy-to-use interface for all age groups
- **High Contrast**: Accessible design for outdoor use
- **Indian Context**: Local names (Ramesh/Suresh), crops (Rabi/Kharif), locations (Karnataka/Punjab)
- **Mobile Responsive**: Works on smartphones and tablets

### Technical Highlights
- **No Frameworks**: Pure HTML5, CSS3, ES6+ JavaScript
- **MVC Architecture**: Clean, maintainable backend structure
- **JWT Security**: Secure authentication with bcrypt hashing
- **Real-time Simulation**: Live IoT data with realistic fluctuations

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (running on localhost:27017)
- VS Code (recommended)

### Installation

1. **Clone & Install**:
   ```bash
   git clone <repository-url>
   cd digifarmhelp
   npm install
   ```

2. **Environment Setup**:
   Create `.env` file:
   ```
   MONGO_URI=mongodb://localhost:27017/digifarmhelp
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=3000
   ```

3. **Seed Database** (Optional - for demo data):
   ```bash
   npm run seed
   ```

4. **Start Server**:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

5. **Access Application**:
   Open `http://localhost:3000` in your browser

## 👥 Demo Accounts

After seeding, use these accounts:

| Role    | Email              | Password    |
|---------|--------------------|-------------|
| Farmer  | ramesh@farmer.com  | password123 |
| Farmer  | suresh@farmer.com  | password123 |
| Labour  | priya@labour.com   | password123 |
| Admin   | admin@digifarm.com | admin123    |

## 📱 Usage Guide

### 1. Landing Page
- View mandi rates ticker
- Learn about platform features
- Navigate to login/signup

### 2. Authentication
- Register as Farmer/Labour
- Login with email/password
- Role-based dashboard access

### 3. Dashboard
- View user profile
- Quick actions menu
- Device status overview
- Recent marketplace items

### 4. Marketplace
- Browse available items
- Filter by category (Seeds/Tools/Livestock)
- View livestock details (milk capacity, lactation stage)
- Add new items for sale
- Contact sellers directly

### 5. IoT Management
- View connected devices
- Add new IoT devices
- Toggle device status
- Monitor smart pump simulation
- Real-time telemetry data

## 🏗️ Project Structure

```
digifarmhelp/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── farmController.js  # Marketplace operations
│   │   └── iotController.js   # IoT device management
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── MarketplaceItem.js # Item schema
│   │   └── IoTDevice.js       # Device schema
│   ├── routes/
│   │   ├── apiRoutes.js       # API endpoints
│   │   └── viewRoutes.js      # Page routes
│   └── app.js                 # Express app setup
├── public/
│   ├── css/
│   │   ├── main.css           # Global styles & design system
│   │   ├── dashboard.css      # Dashboard styles
│   │   └── iot-animations.css # IoT animations
│   ├── js/
│   │   ├── app.js             # Global utilities
│   │   ├── api-client.js      # API client
│   │   └── iot-core.js        # IoT simulation engine
│   ├── views/
│   │   ├── index.html         # Landing page
│   │   ├── login.html         # Login page
│   │   ├── signup.html        # Registration
│   │   ├── dashboard.html     # Main dashboard
│   │   ├── marketplace.html   # Marketplace
│   │   └── iot.html           # IoT management
│   └── assets/
│       └── icons/             # Icon assets
├── .env                       # Environment variables
├── seed.js                    # Database seeding
├── package.json               # Dependencies & scripts
└── README.md                  # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Marketplace
- `GET /api/marketplace` - Get all items
- `POST /api/marketplace` - Create item
- `GET /api/marketplace/:id` - Get item details
- `PUT /api/marketplace/:id` - Update item
- `DELETE /api/marketplace/:id` - Delete item

### IoT Devices
- `GET /api/iot/devices` - Get user devices
- `POST /api/iot/devices` - Add device
- `PUT /api/iot/devices/:id` - Update device
- `DELETE /api/iot/devices/:id` - Remove device
- `PUT /api/iot/devices/:id/toggle` - Toggle device status

## 🎨 Design System

### Color Palette
- **Primary**: #6C2BD9 (Brand Purple)
- **Accent**: #16A34A (Success Green)
- **Warning**: #F59E0B (Alert Orange)
- **Danger**: #EF4444 (Error Red)
- **Dark**: #1F2937 (Text)
- **Light**: #F9FAFB (Background)

### Typography
- **Headings**: Poppins font family
- **Body**: Inter font family
- **Sizes**: Responsive scaling

### Components
- **Buttons**: Primary, Accent, Outline variants
- **Cards**: Shadowed containers with hover effects
- **Forms**: Accessible input styling
- **Grid**: CSS Grid for responsive layouts

## 🧪 Testing

Run the application and test:
- User registration and login
- Marketplace item creation and browsing
- IoT device management
- Smart pump simulation
- Responsive design on mobile

## 🚀 Deployment

### Local Development
```bash
npm run dev  # With nodemon for auto-restart
```

### Production
```bash
npm start
```

### Environment Variables
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 3000)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built for Indian farmers with love
- Inspired by real farming challenges
- Designed with accessibility in mind

---

**Made with ❤️ for Indian Agriculture** 🌾🚜