const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ip = require("ip");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));



// =======================
// USER MODEL
// =======================

const UserSchema = new mongoose.Schema({

  mobile: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  name: String,

});

const User = mongoose.model(
  "User",
  UserSchema
);



// =======================
// MEDICINE MODEL
// =======================

const MedSchema = new mongoose.Schema({

  userId: String,

  name: String,

  dose: String,

  type: String,

  stock: {
    type: Number,
    default: 10,
  },

  image: {
    type: String,
    default: "",
  },

});

const Medication = mongoose.model(
  "Medication",
  MedSchema
);



// =======================
// HISTORY MODEL
// =======================

const HistorySchema =
new mongoose.Schema({

userId:String,

name:String,

date:String,

time:String,

});

const History=mongoose.model(

"History",

HistorySchema

);
// =======================
// REGISTER
// =======================

app.post("/api/register", async (req, res) => {

  try {

    const { name, mobile, password } = req.body;

    const existingUser = await User.findOne({
      mobile,
    });

    if (existingUser) {

      return res.json({
        success: false,
        message: "User already exists",
      });

    }

    const newUser = new User({
      name,
      mobile,
      password,
    });

    await newUser.save();

    res.json({
      success: true,
      message: "Registration Successful",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

});



// =======================
// LOGIN
// =======================

app.post("/api/login", async (req, res) => {

  try {

    const { mobile, password } = req.body;

    const user = await User.findOne({
      mobile,
    });

    if (!user) {

      return res.status(401).json({
        success: false,
        message: "User not found",
      });

    }

    if (user.password !== password) {

      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });

    }

    res.json({

      success: true,

      message: "Login Successful",

      user: {

        name: user.name,

        mobile: user.mobile,

      },

    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

});



// =======================
// ADD MEDICINE
// =======================

app.post("/api/add-medicine", async (req, res) => {

  try {

    const medicine = new Medication(req.body);

    await medicine.save();

    res.json({

      success: true,

      message: "Medicine Saved",

      medicine,

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      error: err.message,

    });

  }

});
// =======================
// GET MEDICINES
// =======================

app.get("/api/medicines/:userId", async (req, res) => {

  try {

    const meds = await Medication.find({
      userId: req.params.userId,
    }).sort({ _id: -1 });

    res.json({
      success: true,
      meds,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }

});



// =======================
// DELETE MEDICINE
// =======================

app.delete("/api/delete-medicine/:id", async (req, res) => {

  try {

    await Medication.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "Medicine Deleted Successfully",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }

});



// =======================
// UPDATE MEDICINE
// =======================

app.put("/api/update-medicine/:id", async (req, res) => {

  try {

    const updatedMedicine =
      await Medication.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new: true,
        }

      );

    if (!updatedMedicine) {

      return res.status(404).json({

        success: false,

        message: "Medicine not found",

      });

    }

    res.json({

      success: true,

      message: "Medicine Updated Successfully",

      medicine: updatedMedicine,

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      error: err.message,

    });

  }

});
// =======================
// MARK MEDICINE TAKEN
// =======================

app.post("/api/mark-taken", async (req, res) => {

  const { id } = req.body;

  try {

    const medicine = await Medication.findById(id);

    if (!medicine) {

      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });

    }

    if (medicine.stock <= 0) {

      return res.json({
        success: false,
        message: "Stock Empty",
      });

    }

    medicine.stock--;

    await medicine.save();

    await History.create({

      userId: medicine.userId,

      name: medicine.name,

      date: new Date().toLocaleDateString(),

      time: new Date().toLocaleTimeString(),

    });

    res.json({

      success: true,

      message: "Dose Taken Successfully",

      newStock: medicine.stock,

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      error: err.message,

    });

  }

});



// =======================
// HISTORY API
// =======================

app.get("/api/history/:userId", async (req, res) => {

  try {

    const history = await History.find({

      userId: req.params.userId,

    }).sort({ _id: -1 });

    res.json({

      success: true,

      history,

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      error: err.message,

    });

  }

});
// =======================
// HEALTH CHECK
// =======================

app.get("/", (req, res) => {

  res.send("🚀 MediBox Backend Running");

});

app.get("/api", (req, res) => {

  res.json({

    success: true,

    message: "MediBox Backend Running Successfully",

    version: "2.0.0",

    apis: [

      "POST /api/register",

      "POST /api/login",

      "POST /api/add-medicine",

      "GET /api/medicines/:userId",

      "PUT /api/update-medicine/:id",

      "DELETE /api/delete-medicine/:id",

      "POST /api/mark-taken",

      "GET /api/history/:userId",

    ],

  });

});



// =======================
// 404 ROUTE
// =======================

app.use((req, res) => {

  res.status(404).json({

    success: false,

    message: "API Not Found",

  });

});



// =======================
// GLOBAL ERROR HANDLER
// =======================

app.use((err, req, res, next) => {

  console.error(err.stack);

  res.status(500).json({

    success: false,

    message: "Internal Server Error",

    error: err.message,

  });

});



// =======================
// START SERVER
// =======================

app.listen(PORT, "0.0.0.0", () => {

  console.log("");

  console.log("====================================");

  console.log("🚀 MediBox Backend Started");

  console.log(`🌐 Local : http://${ip.address()}:${PORT}`);

  console.log(`🌐 API   : http://${ip.address()}:${PORT}/api`);

  console.log("====================================");

});