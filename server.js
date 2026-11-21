const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// =========================
// MIDDLEWARE
// =========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// =========================
// MONGODB CONNECTION
// =========================

const client = new MongoClient(process.env.MONGODB_URI);

let usersCollection;

async function connectDatabase() {
    try {
        await client.connect();

        const db = client.db("SecureSphereDB");
        usersCollection = db.collection("users");

        console.log("✅ MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(
                `🚀 SecureSphere running at http://localhost:${PORT}`
            );
        });

    } catch (error) {
        console.error("❌ MongoDB connection failed");
        console.error(error);
    }
}

connectDatabase();

// =========================
// REGISTER
// =========================

app.post("/api/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters."
            });
        }

        const existingUser =
            await usersCollection.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered."
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        await usersCollection.insertOne({
            email: email,
            password: hashedPassword,
            createdAt: new Date()
        });

        res.status(201).json({
            success: true,
            message: "Account created successfully!"
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during registration."
        });
    }
});

// =========================
// LOGIN
// =========================

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const user =
            await usersCollection.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const passwordMatch =
            await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        res.json({
            success: true,
            message: "Login successful!",
            email: user.email
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during login."
        });
    }
});

// =========================
// TEST ROUTE
// =========================

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "SecureSphere server is working!"
    });
});