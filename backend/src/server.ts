import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./api/auth";
import productRoutes from "./api/products";
import cartRoutes from "./api/cart";
import orderRoutes from "./api/orders";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (_req, res) => {
  res.status(200).json({ status: "Server is running" });
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});