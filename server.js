import express from "express";
import "dotenv/config";
import cors from "cors";
import warehouseRoutes from "./routes/warehouse-routes.js";
import inventoryRoutes from "./routes/inventory-routes.js";

const app = express();

const { CORS_ORIGIN } = process.env;

app.use(cors({ origin: CORS_ORIGIN }));

const PORT = process.env.PORT || 8081;

// all routes
app.use(express.json());
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/inventories", inventoryRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
