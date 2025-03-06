import express from "express";
import * as inventoryController from "../controllers/inventory-controller.js";

const router = express.Router();

router.route("/:id")
  .get(inventoryController.findOneInventory)
  .put(inventoryController.updateInventoryItem);

router.route("/")
  .get(inventoryController.getAllInventories)
  .post(inventoryController.createInventoryItem);

export default router;
