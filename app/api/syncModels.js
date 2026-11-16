import sequelize from "./dbConnection.js";
import "./schemas.js"; // registers all models (Product, Order, Invoice, ...)

async function syncModels() {
    console.log("Function called!");
    try {
        await sequelize.sync({ alter: true });
        console.log("Tables synced successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error syncing tables:", error);
        process.exit(1);
    }
}

syncModels();