import express from "express";
import cors from "cors";

import authRouter from "./api/auth";
import postRouter from "./api/post";

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // фронтенд Vite
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

// Проверка сервера
app.get("/", (req, res) => {
  res.status(200).json({ status: "Server is running" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});