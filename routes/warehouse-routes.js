import express from "express";
import * as warehouseController from "../controllers/warehouse-controller.js";

const router = express.Router();

router.route("/:id").get(warehouseController.findOneWarehouse);

export default router;
