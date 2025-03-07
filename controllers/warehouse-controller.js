import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
import pkg from 'validator';
const { isEmail, isMobilePhone } = pkg;

const getAllWarehouses = async (_req, res) => {
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

// create a new warehouse
const createWarehouse = async (req, res) => {
  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;

  // Validation
  if (!warehouse_name) {
    return res.status(400).json({ error: "Warehouse name is required" });
  }
  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }
  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }
  if (!country) {
    return res.status(400).json({ error: "Country is required" });
  }
  if (!contact_name) {
    return res.status(400).json({ error: "Contact name is required" });
  }
  if (!contact_position) {
    return res.status(400).json({ error: "Contact position is required" });
  }
  if (!contact_phone) {
    return res.status(400).json({ error: "Contact phone is required" });
  }
  if (!isMobilePhone(contact_phone)) {
    return res.status(400).json({ error: "Invalid contact phone number" });
  }
  if (!contact_email) {
    return res.status(400).json({ error: "Contact email is required" });
  }
  if (!isEmail(contact_email)) {
    return res.status(400).json({ error: "Invalid contact email" });
  }

  try {
    // Insert the new warehouse into the database
    const [id] = await knex("warehouses").insert({
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    }).returning('id');

    // Respond with the created warehouse data
    res.status(201).json({
      id,
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    });
  } catch (error) {
    console.error("Error creating warehouse:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export {
  getAllWarehouses,
  findOneWarehouse,
  deleteWarehouse,
  getAllWarehouseInventories,
  createWarehouse
};
