import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await knex("warehouses").select("*");
    res.status(200).json(warehouses);
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const findOneWarehouse = async (req, res) => {
  try {
    const warehousesFound = await knex("warehouses").where({
      id: req.params.id,
    });

    if (warehousesFound.length === 0) {
      return res.status(404).json({
        message: `Warehouse with ID ${req.params.id} not found`,
      });
    }

    const warehouseData = warehousesFound[0];
    res.status(200).json(warehouseData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve warehouse data for warehouse with ID ${req.params.id}`,
    });
  }
};

const deleteWarehouse = async (req, res) => {
  try {
    const whDeleted = await knex("warehouses")
      .where({
        id: req.params.id,
      })
      .delete();

    if (whDeleted === 0) {
      return res
        .status(404)
        .json({ message: `Warehouse with ID ${req.params.id} not found` });
    }
    res.sendStatus(204);
  } catch {
    res
      .status(500)
      .json({ message: `Error deleting warehouse ${req.params.id}` });
  }
};

const getAllWarehouseInventories = async (req, res) => {
  try {
    const warehouseInventories = await knex("inventories").where({
      warehouse_id: req.params.id,
    });

    if (warehouseInventories.length === 0) {
      return res.status(404).json({
        message: `No inventories found for Warehouse with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json(warehouseInventories);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve warehouse inventory data for warehouse with ID ${req.params.id}`,
    });
  }
};

export {
  getAllWarehouses,
  findOneWarehouse,
  deleteWarehouse,
  getAllWarehouseInventories,
};
