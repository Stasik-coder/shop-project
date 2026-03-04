import { Router } from "express";
import prisma from "../db";
import jwt from "jsonwebtoken";

const router = Router();

function authMiddleware(req: any, res: any, next: any) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Создать пост
router.post("/", authMiddleware, async (req: any, res) => {
  const { title, content } = req.body;

  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: req.user.id,
    },
  });

  res.json(post);
});

// Получить посты пользователя
router.get("/", authMiddleware, async (req: any, res) => {
  const posts = await prisma.post.findMany({
    where: { authorId: req.user.id },
    orderBy: { createdAt: "desc" },
  });

  res.json(posts);
});

export default router;