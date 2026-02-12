require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Security middleware
app.use(helmet());
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Custom JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// MongoDB connection
console.log('Attempting to connect to MongoDB...');
const uri = 'mongodb://localhost:27017/trend-analyzer';
console.log('MongoDB URI:', uri); // Local connection doesn't need masking

mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Connection details:', {
      uri: uri,
      state: mongoose.connection.readyState
    });
  });

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  auth0Id: { type: String, unique: true, sparse: true }, // Optional for backward compatibility
  name: { type: String, required: true },
  picture: { type: String },
  profileData: {
    name: {
      value: { type: String, default: '' },
      placeholder: { type: String, default: 'Enter your name' }
    },
    basicDetail: { type: String, default: '' },
    youtubeLink: { type: String, default: '' },
    instagramLink: { type: String, default: '' },
    twitterLink: { type: String, default: '' },
    otherLink: { type: String, default: '' },
    otherLinkLabel: { type: String, default: '' }
  },
  subscription: {
    plan: { type: String, default: 'basic' },
    status: { type: String, default: 'active' },
    scriptsIncluded: { type: Number, default: 2 },
    scriptsRemaining: { type: Number, default: 2 },
    totalScripts: { type: Number, default: 2 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    price: { type: Number },
    currency: { type: String },
    paymentId: { type: String },
    orderId: { type: String },
    paymentMethod: { type: String }
  },
  socialAnalytics: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Helper to format user response consistently
const formatUserResponse = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  return {
    ...userObj,
    id: userObj._id,
    sub: userObj._id
  };
};

// Routes

// Auth Routes

// Build Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      profileData: {
        name: { value: name, placeholder: 'Enter your name' }
      }
    });

    const savedUser = await newUser.save();
    const userResponse = formatUserResponse(savedUser);

    // Create Token
    const token = jwt.sign({ sub: userResponse.sub, email: userResponse.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, user: userResponse });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Build Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const userResponse = formatUserResponse(user);
    const token = jwt.sign({ sub: userResponse.sub, email: userResponse.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, user: userResponse });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(formatUserResponse(user));
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save/update user profile (supports POST or PUT)
const handleProfileUpdate = async (req, res) => {
  try {
    const { profileData, subscription } = req.body;

    // Prepare update object with $set
    const setQuery = {
      updatedAt: new Date()
    };

    // Use dot notation to merge profileData fields
    if (profileData) {
      Object.keys(profileData).forEach(key => {
        setQuery[`profileData.${key}`] = profileData[key];
      });

      // Also update top-level name if provided in profileData
      if (profileData.name && profileData.name.value) {
        setQuery.name = profileData.name.value;
      }
    }

    if (subscription) {
      Object.keys(subscription).forEach(key => {
        setQuery[`subscription.${key}`] = subscription[key];
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.sub,
      { $set: setQuery },
      { upsert: true, new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(formatUserResponse(user));
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

app.post('/api/users/profile', authenticateToken, handleProfileUpdate);
app.put('/api/users/profile', authenticateToken, handleProfileUpdate);

// Create/update user (Legacy Auth0 route - keeping for reference or cleaning up)
// Since we are moving to custom auth, the 'login/register' handles creation.
// We can deprecate this or leave it as a protected route if needed for profile syncs.
app.post('/api/users', authenticateToken, async (req, res) => {
  // Implementation optional if using strictly custom auth
  res.status(200).json({ message: "Use /api/auth/register or /api/auth/login" });
});

// Update subscription
app.put('/api/users/subscription', authenticateToken, async (req, res) => {
  try {
    const { subscription } = req.body;

    const setQuery = {
      updatedAt: new Date()
    };

    if (subscription) {
      Object.keys(subscription).forEach(key => {
        setQuery[`subscription.${key}`] = subscription[key];
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.sub,
      { $set: setQuery },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(formatUserResponse(user));
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update social analytics
app.put('/api/users/social-analytics', authenticateToken, async (req, res) => {
  try {
    const { socialAnalytics } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.sub,
      {
        $set: {
          socialAnalytics: socialAnalytics,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(formatUserResponse(user));
  } catch (error) {
    console.error('Error updating social analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
