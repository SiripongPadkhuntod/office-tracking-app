import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = await mysql.createConnection({
  host: process.env.DB_HOST || "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
  user: process.env.DB_USER || "en1toNrNuCkTnHQ.root",
  password: process.env.DB_PASS || "SBqp8W8hFOj20bBi",
  database: process.env.DB_NAME || "test",
  ssl: { rejectUnauthorized: true } 
});

export default db;
