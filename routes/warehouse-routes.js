import express from "express";
import * as warehouseController from "../controllers/warehouse-controller.js";

const router = express.Router();

router.route("/").get(warehouseController.getAllWarehouses);
router
  .route("/:id")
  .get(warehouseController.findOneWarehouse)
  .delete(warehouseController.deleteWarehouse);

export default router;
