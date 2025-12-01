const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ip = require('ip'); // Used for finding the local IP
require('dotenv').config();

const app = express();
const PORT = 3000;

// --- Configuration ---
app.use(cors());
app.use(express.json());

// IMPORTANT: REPLACE 'YOUR_MONGODB_STRING' with your Atlas connection string
const MONGO_URI = "mongodb+srv://MediBox:Amit123@cluster0.gsay5pl.mongodb.net/?appName=Cluster0ongodb+srv://amit:Amit12345@cluster0.abcde.mongodb.net/medibox?retryWrites=true&w=majority";
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Error:', err));

// --- Data Model (Simplified for Demo) ---
const UserSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String
});
const User = mongoose.model('User', UserSchema);

// --- API ROUTES ---

// Register
app.post('/api/register', async (req, res) => {
  const { name, mobile, password } = req.body;
  try {
    const newUser = new User({ name, mobile, password });
    await newUser.save();
    res.json({ success: true, message: 'User Registered!' });
  } catch (err) {
    res.status(400).json({ success: false, message: 'User already exists' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { mobile, password } = req.body;
  const user = await User.findOne({ mobile });

  if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid Credentials' });
  }
  res.json({ success: true, message: 'Login Successful', user: { name: user.name, mobile: user.mobile } });
});

// --- MEDICATION MODEL ---
const MedSchema = new mongoose.Schema({
  userId: String,
  name: String,
  dose: String,
  type: String,
  stock: { type: Number, default: 10 } // NEW: Tracks how many pills are left
});
const Medication = mongoose.model('Medication', MedSchema);

// --- API ROUTES ---

// 1. Save a new medicine
app.post('/api/add-medicine', async (req, res) => {
  try {
    const newMed = new Medication(req.body);
    await newMed.save();
    res.json({ success: true, message: 'Medicine Saved!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Get all medicines for a user
app.get('/api/medicines/:userId', async (req, res) => {
  try {
    const meds = await Medication.find({ userId: req.params.userId });
    res.json({ success: true, meds });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Delete Medicine
app.delete('/api/delete-medicine/:id', async (req, res) => {
  try {
    await Medication.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Medicine Deleted!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Mark Medicine as Taken (Decrement Stock)
app.post('/api/mark-taken', async (req, res) => {
  const { id } = req.body;
  try {
    const med = await Medication.findById(id);
    if (med) {
      if (med.stock > 0) {
        med.stock = med.stock - 1; // Decrease count
        await med.save();
        res.json({ success: true, message: 'Dose Taken!', newStock: med.stock });
      } else {
        res.json({ success: false, message: 'Stock is empty! Refill needed.' });
      }
    } else {
      res.status(404).json({ success: false, message: 'Medicine not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- START SERVER ---
app.listen(PORT, '0.0.0.0', () => {
    // Use ip.address() to get the local network IP for the mobile app to connect
    console.log(`🚀 Server running at: http://${ip.address()}:${PORT}`);
});
