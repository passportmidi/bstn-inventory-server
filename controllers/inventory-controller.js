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
    const inventoryData = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "warehouses.id")
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      .where("inventories.id", req.params.id)
      .first();

    if (!inventoryData) {
      return res.status(404).json({
        message: `Inventory with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json(inventoryData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve inventory data for ID ${req.params.id}`,
    });
  }
};

const createInventoryItem = async (req, res) => {
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;

  if (
    !warehouse_id ||
    !item_name ||
    !description ||
    !category ||
    !status ||
    quantity === undefined
  ) {
    return res.status(400).json({
      message:
        "All fields (warehouse_id, item_name, description, category, status, quantity) are required.",
    });
  }

  if (typeof quantity !== "number") {
    return res.status(400).json({
      message: "Quantity must be a number.",
    });
  }

  try {
    const warehouseExists = await knex("warehouses")
      .where({ id: warehouse_id })
      .first();
    if (!warehouseExists) {
      return res.status(400).json({
        message: `Warehouse with ID ${warehouse_id} does not exist.`,
      });
    }

    await knex("inventories").insert({
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity,
    });

    const newInventoryItem = await knex("inventories")
      .where({
        warehouse_id,
        item_name,
        description,
        category,
        status,
        quantity,
      })
      .first();

    res.status(201).json(newInventoryItem);
  } catch (error) {
    console.error("Error creating inventory item:", error);
    res.status(500).json({
      message: "Unable to create new inventory item.",
    });
  }
};

const deleteInventory = async (req, res) => {
  try {
    const invDeleted = await knex("inventories")
      .where({
        id: req.params.id,
      })
      .delete();

    if (invDeleted === 0) {
      return res
        .status(404)
        .json({ message: `Inventory with ID ${req.params.id} not found` });
    }
    res.sendStatus(204);
  } catch {
    res
      .status(500)
      .json({ message: `Error deleting inventory ${req.params.id}` });
  }
};

const updateInventoryItem = async (req, res) => {
  const { id } = req.params;
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;

  if (
    !warehouse_id ||
    !item_name ||
    !description ||
    !category ||
    !status ||
    quantity === undefined
  ) {
    return res.status(400).json({
      message:
        "All fields (warehouse_id, item_name, description, category, status, quantity) are required.",
    });
  }

  if (typeof quantity !== "number") {
    return res.status(400).json({
      message: "Quantity must be a number.",
    });
  }

  try {
    const inventoryExists = await knex("inventories").where({ id }).first();
    if (!inventoryExists) {
      return res.status(404).json({
        message: `Inventory with ID ${id} not found.`,
      });
    }

    const warehouseExists = await knex("warehouses")
      .where({ id: warehouse_id })
      .first();
    if (!warehouseExists) {
      return res.status(400).json({
        message: `Warehouse with ID ${warehouse_id} does not exist.`,
      });
    }

    await knex("inventories").where({ id }).update({
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity,
    });

    const updatedInventoryItem = await knex("inventories")
      .where({ id })
      .first();

    res.status(200).json(updatedInventoryItem);
  } catch (error) {
    console.error("Error updating inventory item:", error);
    res.status(500).json({
      message: "Unable to update inventory item.",
    });
  }
};

export {
  findOneInventory,
  getAllInventories,
  createInventoryItem,
  updateInventoryItem,
  deleteInventory,
};
