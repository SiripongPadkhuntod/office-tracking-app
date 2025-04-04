import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Fetch user from database using connection from pool
      const [rows] = await db.execute("SELECT id, name, email FROM users WHERE id = ?", [decoded.id]);
      
      if (rows.length === 0) {
        return res.status(200).json({ status: 401, message: "User not found" });
      }
      
      req.user = rows[0]; // Attach user to request object
      next();
      
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(200).json({ status: 401, message: "Not authorized, token failed" });
    }
  }
  
  if (!token) {
    return res.status(200).json({ status: 401, message: "Not authorized, no token" });
  }
};