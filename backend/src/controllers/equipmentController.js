import db from "../config/db.js";


// Function to log actions (add, update, delete)
const logAction = async (action_type, equipment_id, user_id, details) => {
    try {
        await db.execute(
            "INSERT INTO logs (action_type, equipment_id, user_id, details) VALUES (?, ?, ?, ?)",
            [action_type, equipment_id, user_id, details]
        );
    } catch (error) {
        console.error("Error logging action:", error.message);
    }
};


// GET /api/equipment
export const getAllEquipment = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM equipment WHERE active = 1");
        res.status(200).json({ status: 200, length: rows.length, data: rows });
    } catch (error) {
        res.status(200).json({ status: 500, message: error.message });
    }
};


export const searchEquipment = async (req, res) => {
    try {
        const { type, startDate, endDate, searchType, searchTerm, createdStartDate, createdEndDate } = req.query;
        console.log("req.query", req.query);
        let query = "SELECT * FROM equipment WHERE active = 1";
        const params = [];

        if (type) {
            query += " AND LOWER(type) = LOWER(?)";
            params.push(type);
        }
        
        // Handle code search with range support (e.g., 180002-180010)
        if (searchType && searchType.toLowerCase() === "code" && searchTerm) {
            if (searchTerm.includes('-')) {
                // Handle range search
                const [startCode, endCode] = searchTerm.split('-');
                if (startCode && endCode) {
                    query += " AND id >= ? AND id <= ?";
                    params.push(startCode.trim(), endCode.trim());
                }
            } else {
                // Regular code search
                query += " AND LOWER(id) LIKE ?";
                params.push(searchTerm.toLowerCase());
            }
        }
        else if (searchType && searchType === "name" && searchTerm ) {
            query += " AND LOWER(name) LIKE LOWER(?)";
            params.push(`%${searchTerm.toLowerCase()}%`);
        }


        if (startDate && endDate) {
            query += " AND purchase_date BETWEEN ? AND ?";
            params.push(startDate, endDate);
        } else if (startDate) {
            query += " AND purchase_date >= ?";
            params.push(startDate);
        } else if (endDate) {
            query += " AND purchase_date <= ?";
            params.push(endDate);
        }
        
        // Handle created_at date filtering
        if (createdStartDate && createdEndDate) {
            query += " AND created_at BETWEEN ? AND ?";
            params.push(`${createdStartDate} 00:00:00`, `${createdEndDate} 23:59:59`);
        } else if (createdStartDate) {
            query += " AND created_at >= ?";
            params.push(`${createdStartDate} 00:00:00`);
        } else if (createdEndDate) {
            query += " AND created_at <= ?";
            params.push(`${createdEndDate} 23:59:59`);
        }
        
;

        console.log("query", query);
        console.log("params", params);
        const [rows] = await db.execute(query, params);
        res.status(200).json({ status: 200, length: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};



// Add Equipment
export const addEquipment = async (req, res) => {
    const { type, name, purchase_date, details, status } = req.body;
    const user_id = req.user.id;  // Assuming user info is available in the request

    try {
        const result = await db.execute("INSERT INTO equipment (type, name, purchase_date, details, status) VALUES (?, ?, ?, ?, ?)",
            [type, name, purchase_date, details, status]);
        await logAction('add', result[0].insertId, user_id, `Added new equipment: ${name}`);
        res.status(200).json({ status: 201, message: "Equipment added successfully" });
    } catch (error) {
        res.status(200).json({ status: 500, message: error.message });
    }
};

// Update Equipment
export const updateEquipment = async (req, res) => {
    const { id } = req.params; 
    const { type, name, purchase_date, details, status } = req.body;
    const user_id = req.user.id; 

    try {
        const [existingEquipment] = await db.execute("SELECT * FROM equipment WHERE id = ?", [id]);
        if (existingEquipment.length === 0) {
            return res.status(404).json({ status: 404, message: "Equipment not found" });
        }

        // Update the equipment details
        await db.execute(
            "UPDATE equipment SET type = ?, name = ?, purchase_date = ?, details = ?, status = ? WHERE id = ?",
            [type, name, purchase_date, details, status, id]
        );

        // Log the update action
        await logAction('update', id, user_id, `Updated equipment: ${name}`);

        res.status(200).json({ status: 200, equipment_id: id, message: "Equipment updated successfully" });
    } catch (error) {
        res.status(200).json({ status: 500, message: error.message });
    }
};

// Delete Equipment
export const deleteEquipment = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;  // Assuming user info is available in the request

    try {
        const [existingEquipment] = await db.execute("SELECT * FROM equipment WHERE id = ? ", [id]);
        if (existingEquipment.length === 0) {
            return res.status(404).json({ status: 404, message: "Equipment not found" });
        }

        // Delete the equipment (set active to 0)
        await db.execute("UPDATE equipment SET active = 0 WHERE id = ?", [id]);

        

        // Log the delete action
        await logAction('delete', id, user_id, `Deleted equipment: ${existingEquipment[0].name}`);

        res.status(200).json({ status: 200, message: "Equipment deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

export const getEquipmentById = async (req, res) => {
    const { id } = req.params; // Get the equipment ID from the URL parameter

    try {
        const [rows] = await db.execute("SELECT * FROM equipment WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ status: 404, message: "Equipment not found" });
        }

        res.status(200).json({ status: 200, data: rows[0] });
    } catch (error) {
        res.status(200).json({ status: 500, message: error.message });
    }
}
