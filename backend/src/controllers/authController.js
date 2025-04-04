import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Register User
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate input
    if (!validator.isEmail(email)) {
      return res.status(200).json({ status: 400, message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res.status(200).json({ status: 400, message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    if (rows.length > 0) {
      return res.status(200).json({ status: 409, message: "Email already exists" });
    }

    // Hash Password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(200).json({ status: 500, message: "Error hashing password" });
    }

    // Insert user into database
    await db.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

    res.status(200).json({ status: 200, message: "User registered successfully" });
  } catch (error) {
    res.status(200).json({ status: 500, message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    if (rows.length === 0) {
      return res.status(200).json({ status: 404, message: "User not found" });
    }

    const user = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({ status: 401, message: "Invalid email or password" });
    }


    const token = generateToken(user.ID);

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 200,
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(200).json({ status: 500, message: error.message, error: "Login" });
  }
};

// Get Profile (Protected)
export const getProfile = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT id, name, email FROM users WHERE id = ?", [req.user.id]);
    if (rows.length === 0) {
      return res.status(200).json({ status: 404, message: "User not found" });
    }

    res.status(200).json({ status: 200, user: rows[0] });
  } catch (error) {
    res.status(200).json({ status: 500, message: error.message });
  }
};
