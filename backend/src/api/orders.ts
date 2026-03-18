import { Router } from "express";
import prisma from "../prisma";
import jwt from "jsonwebtoken";

const router = Router();

function getUserFromToken(req: any) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    return jwt.verify(token, process.env.JWT_SECRET || "supersecret") as {
      id: number;
      role: "USER" | "ADMIN";
      email: string;
    };
  } catch {
    return null;
  }
}

// CHECKOUT
router.post("/checkout", async (req: any, res) => {
  try {
    const user = getUserFromToken(req);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    await prisma.cartItem.deleteMany({
      where: { userId: user.id },
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error("CHECKOUT ERROR:", error);
    return res.status(500).json({ message: "Server error during checkout" });
  }
});

// USER ORDERS OR ALL ORDERS FOR ADMIN
router.get("/", async (req: any, res) => {
  try {
    const user = getUserFromToken(req);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = await prisma.order.findMany({
      where: user.role === "ADMIN" ? {} : { userId: user.id },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(orders);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;