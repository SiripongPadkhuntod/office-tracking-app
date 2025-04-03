import db from "../config/db.js";

//สำหรับการดึงข้อมูลผู้ใช้ทั้งหมด และ การค้นหาผู้ใช้ตามชื่อ และการแก้ไขข้อมูลผู้ใช้

export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM users");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getUserByName = async (req, res) => {
  const { name } = req.params;
  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE LOWER(name) LIKE LOWER(?)", [`%${name}%`]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
    // Check if user exists
    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user in database
    await db.execute("UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?", [name, email, password, id]);
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
