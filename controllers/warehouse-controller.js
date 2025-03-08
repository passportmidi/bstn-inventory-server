import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
import pkg from 'validator';
const { isEmail} = pkg;

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

  if (
    !warehouse_name ||
    !address ||
    !city ||
    !country ||
    !contact_name ||
    !contact_position ||
    !contact_phone ||
    !contact_email
  ) {
    return res.status(400).json({
      message:
        "All fields (warehouse_name, address, city, country, contact_name, contact_position, contact_phone, contact_email) are required.",
    });
  }

  if (!contact_phone.startsWith("+1")) {
    return res.status(400).json({
      message: "Contact phone must start with +1.",
    });
  }

  if (!isEmail(contact_email)) {
    return res.status(400).json({
      message: "Invalid contact email.",
    });
  }

  try {
    const [id] = await knex("warehouses")
      .insert({
        warehouse_name,
        address,
        city,
        country,
        contact_name,
        contact_position,
        contact_phone,
        contact_email,
      })
      .returning("id");

    const newWarehouse = await knex("warehouses").where({ id }).first();

    res.status(201).json(newWarehouse);
  } catch (error) {
    console.error("Error creating warehouse:", error);
    res.status(500).json({
      message: "Unable to create new warehouse.",
    });
  }
};

const updateWarehouse = async (req, res) => {
  const { id } = req.params;
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

  if (
    !warehouse_name ||
    !address ||
    !city ||
    !country ||
    !contact_name ||
    !contact_position ||
    !contact_phone ||
    !contact_email
  ) {
    return res.status(400).json({
      message:
        "All fields (warehouse_name, address, city, country, contact_name, contact_position, contact_phone, contact_email) are required.",
    });
  }

  if (!contact_phone.startsWith("+1")) {
    return res.status(400).json({
      message: "Contact phone must start with +1.",
    });
  }

  if (!isEmail(contact_email)) {
    return res.status(400).json({
      message: "Invalid contact email.",
    });
  }

  try {
    const warehouseExists = await knex("warehouses").where({ id }).first();
    if (!warehouseExists) {
      return res.status(404).json({
        message: `Warehouse with ID ${id} not found.`,
      });
    }

    await knex("warehouses").where({ id }).update({
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    });

    const updatedWarehouse = await knex("warehouses").where({ id }).first();

    res.status(200).json(updatedWarehouse);
  } catch (error) {
    console.error("Error updating warehouse:", error);
    res.status(500).json({
      message: "Unable to update warehouse.",
    });
  }
};

export {
  getAllWarehouses,
  findOneWarehouse,
  deleteWarehouse,
  getAllWarehouseInventories,
  createWarehouse,
  updateWarehouse
};
