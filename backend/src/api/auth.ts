import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db";

const router = express.Router();

const JWT_SECRET = "supersecret"; // позже вынесем в .env

// ================= REGISTER =================
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { username, email, password: hashedPass },
    });

    return res.status(201).json({ message: "User created" });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ error: "Server error", details: error });
  }
});


// ================= LOGIN =================
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ token });

  } catch (error) {
    console.error("LOGIN ERROR:", error);   // 🔥 теперь увидим настоящую причину
    return res.status(500).json({ error: "Server error", details: error });
  }
});

export default router;