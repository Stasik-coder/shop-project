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

// GET cart items
router.get("/", async (req: any, res) => {
  try {
    const user = getUserFromToken(req);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const items = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(items);
  } catch (error) {
    console.error("GET CART ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ADD to cart
router.post("/", async (req: any, res) => {
  try {
    const user = getUserFromToken(req);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: Number(productId),
        },
      },
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + 1,
        },
        include: {
          product: true,
        },
      });

      return res.json(updatedItem);
    }

    const newItem = await prisma.cartItem.create({
      data: {
        userId: user.id,
        productId: Number(productId),
        quantity: 1,
      },
      include: {
        product: true,
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE quantity
router.put("/:id", async (req: any, res) => {
  try {
    const user = getUserFromToken(req);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Valid quantity is required" });
    }

    const item = await prisma.cartItem.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!item || item.userId !== user.id) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: Number(req.params.id) },
      data: {
        quantity: Number(quantity),
      },
      include: {
        product: true,
      },
    });

    res.json(updatedItem);
  } catch (error) {
    console.error("UPDATE CART ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE cart item
router.delete("/:id", async (req: any, res) => {
  try {
    const user = getUserFromToken(req);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const item = await prisma.cartItem.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!item || item.userId !== user.id) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await prisma.cartItem.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("DELETE CART ITEM ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;