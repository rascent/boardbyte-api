import "dotenv/config";
import express, { Router } from "express";
import { handleRoutes } from "./router";

const app = express();
const PORT = process.env.PORT || 3010;
const router = Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use("/api", handleRoutes(router));
