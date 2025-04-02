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
        const [rows] = await db.execute("SELECT * FROM equipment");
        res.status(200).json({ status: 200, length:rows.length, data: rows });
    } catch (error) {
        res.status(200).json({ status: 500, message: error.message });
    }
};


// GET /api/equipment/search
export const searchEquipment = async (req, res) => {
    const { type, id, name, purchase_date, created_at } = req.query;
    let query = "SELECT * FROM equipment WHERE 1";
    const params = [];

    // Filter by 'type'
    if (type) {
        query += " AND type = ?"; 
        params.push(type);
    }

    // Filter by 'id'
    if (id) {
        query += " AND id = ?";
        params.push(id);
    }

    // Filter by 'name' (case-insensitive)
    if (name) {
        query += " AND LOWER(name) LIKE LOWER(?)"; 
        params.push(`%${name.toLowerCase()}%`);
    }

    // Filter by 'purchase_date' in 'DD/MM/YYYY' format
    if (purchase_date) {
        // Convert the 'purchase_date' from 'DD/MM/YYYY' to 'YYYY-MM-DD' format
        const [day, month, year] = purchase_date.split('/');
        const formattedDate = `${year}-${month}-${day}`; // Convert to 'YYYY-MM-DD' format

        query += " AND DATE_FORMAT(purchase_date, '%d/%m/%Y') = ?";
        params.push(`${day}/${month}/${year}`); // Compare using 'DD/MM/YYYY' format
    }

    // Filter by 'created_at' in 'DD/MM/YYYY' format
    if (created_at) {
        const [day, month, year] = created_at.split('/');
        const formattedDate = `${year}-${month}-${day}`;

        query += " AND DATE_FORMAT(created_at, '%d/%m/%Y') = ?";
        params.push(`${day}/${month}/${year}`); // Compare using 'DD/MM/YYYY' format
    }

    try {
        const [rows] = await db.execute(query, params);
        res.status(200).json({ status: 200, length: rows.length, data: rows });
    } catch (error) {
        res.status(200).json({ status: 500, message: error.message });
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
    const { id } = req.params; // Get the equipment ID from the URL parameter
    const { type, name, purchase_date, details, status } = req.body;
    const user_id = req.user.id;  // Assuming user info is available in the request

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

        res.status(200).json({ status: 200, equipment_id:id, message: "Equipment updated successfully" });
    } catch (error) {
        res.status(200).json({ status: 500, message: error.message });
    }
};

// // Delete Equipment
// export const deleteEquipment = async (req, res) => {
//     const { id } = req.params;
//     const user_id = req.user.id;  // Assuming user info is available in the request

//     try {
//         const [existingEquipment] = await db.execute("SELECT * FROM office_equipment WHERE id = ?", [id]);
//         if (existingEquipment.length === 0) {
//             return res.status(404).json({ status: 404, message: "Equipment not found" });
//         }

//         // Delete the equipment
//         await db.execute("DELETE FROM office_equipment WHERE id = ?", [id]);

//         // Log the delete action
//         await logAction('delete', id, user_id, `Deleted equipment with ID: ${id}`);

//         res.status(200).json({ status: 200, message: "Equipment deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ status: 500, message: error.message });
//     }
// };

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
