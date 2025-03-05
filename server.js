import "dotenv/config";
import cors from "cors";
import warehouseRoutes from './routes/warehouseRoutes.js'; 

const app = express();

app.use(cors());

const PORT = process.env.PORT || 8081;

// all routes
app.use(express.json());
// app.use("/api/warehouses", warehouseRoutes);


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
