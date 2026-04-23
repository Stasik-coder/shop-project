import { Router } from "express";
import prisma from "../prisma";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// получить или создать чат текущего пользователя
router.get("/my-chat", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    let chat = await prisma.supportChat.findFirst({
      where: { userId },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
        messages: {
          include: {
            sender: {
              select: { id: true, name: true, role: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chat) {
      chat = await prisma.supportChat.create({
        data: { userId },
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true },
          },
          messages: {
            include: {
              sender: {
                select: { id: true, name: true, role: true },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
      });
    }

    return res.json(chat);
  } catch (error) {
    console.error("GET MY CHAT ERROR:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// список чатов для админа
router.get("/admin/chats", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const chats = await prisma.supportChat.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: {
              select: { id: true, name: true, role: true },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return res.json(chats);
  } catch (error) {
    console.error("GET ADMIN CHATS ERROR:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// чат по id для админа
router.get("/admin/chats/:chatId", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const chatId = Number(req.params.chatId);

    const chat = await prisma.supportChat.findUnique({
      where: { id: chatId },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
        messages: {
          include: {
            sender: {
              select: { id: true, name: true, role: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    return res.json(chat);
  } catch (error) {
    console.error("GET ADMIN CHAT ERROR:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;