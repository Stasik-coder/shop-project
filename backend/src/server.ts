import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import authRouter from "./api/auth";
import productRoutes from "./api/products";
import cartRoutes from "./api/cart";
import orderRoutes from "./api/orders";
import supportRoutes from "./api/support";
import { registerSupportSocket } from "./socket/supportSocket";

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
app.use("/api/support", supportRoutes);

app.get("/", (_req, res) => {
  res.status(200).json({ status: "Server is running" });
});

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

registerSupportSocket(io);

const PORT = Number(process.env.PORT) || 3000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});