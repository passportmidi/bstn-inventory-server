import express from "express";
import "dotenv/config";
import cors from "cors";
import warehouseRouter from './routes/warehouseRouter.js'; 

const app = express();

const { CORS_ORIGIN } = process.env;

app.use(cors({ origin: CORS_ORIGIN }));

const PORT = process.env.PORT || 8081;

app.use('/api/warehouses', warehouseRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
