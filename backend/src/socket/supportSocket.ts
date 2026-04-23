import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import prisma from "../prisma";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

type JwtUser = {
  id: number;
  role: "USER" | "ADMIN";
  email: string;
};

function getRoomNameByUserId(userId: number) {
  return `support_user_${userId}`;
}

function extractToken(socket: Socket) {
  const authToken = socket.handshake.auth?.token;
  if (authToken) return authToken;

  const header = socket.handshake.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    return header.split(" ")[1];
  }

  return null;
}

export function registerSupportSocket(io: Server) {
  io.use((socket, next) => {
    try {
      const token = extractToken(socket);

      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const decoded = jwt.verify(token, JWT_SECRET) as JwtUser;
      socket.data.user = decoded;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", async (socket) => {
    const user = socket.data.user as JwtUser;

    if (!user) {
      socket.disconnect();
      return;
    }

    if (user.role === "USER") {
      const room = getRoomNameByUserId(user.id);
      await socket.join(room);

      let chat = await prisma.supportChat.findFirst({
        where: { userId: user.id },
      });

      if (!chat) {
        chat = await prisma.supportChat.create({
          data: { userId: user.id },
        });
      }

      const messages = await prisma.supportMessage.findMany({
        where: { chatId: chat.id },
        include: {
          sender: {
            select: { id: true, name: true, role: true },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      socket.emit("support:history", {
        chatId: chat.id,
        room,
        messages,
      });
    }

    socket.on("support:join-admin", async ({ chatId }, callback) => {
      try {
        if (user.role !== "ADMIN") {
          callback?.({ ok: false, error: "Forbidden" });
          return;
        }

        const chat = await prisma.supportChat.findUnique({
          where: { id: Number(chatId) },
          include: {
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
          callback?.({ ok: false, error: "Chat not found" });
          return;
        }

        const room = getRoomNameByUserId(chat.userId);
        await socket.join(room);

        socket.emit("support:history", {
          chatId: chat.id,
          room,
          messages: chat.messages,
        });

        callback?.({ ok: true });
      } catch (error) {
        callback?.({
          ok: false,
          error: error instanceof Error ? error.message : "Join error",
        });
      }
    });

    socket.on("support:message", async ({ chatId, text }, callback) => {
      try {
        const normalizedText = String(text || "").trim().replace(/\s+/g, " ");

        if (!normalizedText) {
          callback?.({ ok: false, error: "Empty message" });
          return;
        }

        if (normalizedText.length > 500) {
          callback?.({ ok: false, error: "Message too long" });
          return;
        }

        const chat = await prisma.supportChat.findUnique({
          where: { id: Number(chatId) },
        });

        if (!chat) {
          callback?.({ ok: false, error: "Chat not found" });
          return;
        }

        if (user.role !== "ADMIN" && chat.userId !== user.id) {
          callback?.({ ok: false, error: "Forbidden" });
          return;
        }

        const message = await prisma.supportMessage.create({
          data: {
            chatId: chat.id,
            senderId: user.id,
            text: normalizedText,
          },
          include: {
            sender: {
              select: { id: true, name: true, role: true },
            },
          },
        });

        await prisma.supportChat.update({
          where: { id: chat.id },
          data: { updatedAt: new Date() },
        });

        const room = getRoomNameByUserId(chat.userId);
        io.to(room).emit("support:new-message", message);

        callback?.({ ok: true });
      } catch (error) {
        callback?.({
          ok: false,
          error: error instanceof Error ? error.message : "Send error",
        });
      }
    });
  });
}