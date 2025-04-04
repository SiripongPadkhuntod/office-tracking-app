import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import equipmentRoutes from "./routes/equipmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test DB Connection
db.query("SELECT 1")
  .then(() => console.log("Connected to MySQL"))
  .catch((err) => console.error("Database Connection Error:", err));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api", equipmentRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send({
    status: 200,
    message: "Welcome to the Equipment Management API",
    routes: {
        auth: {
          login: "/api/auth/login",
          register: "/api/auth/register",
          profile : "/api/auth/profile",
        },
      equipment: "/api/equipment",
      users: "/api/users",
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
