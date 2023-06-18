import "dotenv/config";
import express, { Router } from "express";
import { handleProductsRoutes } from "./routes/products";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

const router = Router();

handleProductsRoutes(router);
