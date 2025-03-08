import express from "express";
import * as warehouseController from "../controllers/warehouse-controller.js";

const router = express.Router();

router
  .route("/")
  .get(warehouseController.getAllWarehouses)
  .post(warehouseController.createWarehouse);

router
  .route("/:id")
  .get(warehouseController.findOneWarehouse)
  .put(warehouseController.updateWarehouse) 
  .delete(warehouseController.deleteWarehouse);

router
  .route("/:id/inventories")
  .get(warehouseController.getAllWarehouseInventories);

export default router;
