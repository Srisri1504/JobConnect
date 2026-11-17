const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Application = require("./models/Application");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("JobConnect Backend is Running!");
});

app.get("/api/test", (req, res) => {
  app.get("/api/my-applications", async (req, res) => {
    try {
      const email = req.query.email;
      const applications = await Application.find({ email });
      res.status(200).json(applications);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });
  res.json({ message: "Frontend and Backend Connected Successfully!" });
});

// REGISTER
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields!" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "jobseeker",
    });

    await newUser.save();

    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Registration failed!" });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    res.status(200).json({
      message: "Login successful!",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ message: "Login failed!" });
  }
});

// GET MY APPLICATIONS
app.get("/api/my-applications", async (req, res) => {
  try {
    const email = req.query.email;

    const applications = await Application.find({ email: email });

    return res.status(200).json(applications);
  } catch (error) {
    console.log("Fetch Applications Error:", error);
    return res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
});

app.post("/api/apply", async (req, res) => {
  console.log("APPLY API CALLED");

  try {
    const { applicantName, email, jobRole, company, location } = req.body;

    if (!applicantName || !email || !jobRole || !company || !location) {
      return res.status(400).json({
        message: "Please fill all details!",
      });
    }

    const application = new Application({
      applicantName,
      email,
      jobRole,
      company,
      location,
    });

    await application.save();

    res.status(201).json({
      message: "Application submitted successfully!",
    });
  } catch (error) {
    console.log("Application Error:", error);
    res.status(500).json({
      message: "Application failed!",
    });
  }
});

const PORT = 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((error) => console.log("MongoDB Error:", error));

app.listen(PORT, () => {
  console.log(`JobConnect Server running on port ${PORT}`);
});
