import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const getAllInventories = async (req, res) => {
  try {
    const inventories = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "warehouses.id")
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      );

    res.status(200).json(inventories);
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve inventory data",
    });
  }
};

const findOneInventory = async (req, res) => {
  try {
    const inventoriesFound = await knex("inventories").where({
      id: req.params.id,
    });

    if (inventoriesFound.length === 0) {
      return res.status(404).json({
        message: `Inventory with ID ${req.params.id} not found`,
      });
    }

    const inventoryData = inventoriesFound[0];
    res.status(200).json(inventoryData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve inventory data for inventory with ID ${req.params.id}`,
    });
  }
};

export { findOneInventory, getAllInventories };
