import express from 'express';
import knex from '../db/knex.js'; // We still need to set this up

const router = express();

router.get('/', async (req, res) => {
    try {
      const warehouses = await knex('warehouses').select('*'); 
      res.status(200).json(warehouses);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

export default router;