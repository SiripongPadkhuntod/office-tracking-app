import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Connection pool with proper SSL configuration for TiDB Cloud
const pool = mysql.createPool({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASS ,
  database: process.env.DB_NAME ,
  ssl: {
    rejectUnauthorized: true,
    // You may need to specify these options depending on your TiDB Cloud configuration
    // minVersion: 'TLSv1.2',
    // enableTrace: true
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Successfully connected to TiDB Cloud database");
    connection.release();
  } catch (error) {
    console.error("Database Connection Error:", error);
    // Don't throw here, just log the error
  }
};

testConnection();

export default pool;