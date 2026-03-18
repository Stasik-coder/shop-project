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

// GET all products
router.get("/", async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET one product
router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE product (admin only)
router.post("/", async (req: any, res) => {
  try {
    const user = getUserFromToken(req);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({ message: "Only admin can add products" });
    }

    const { name, description, price, image } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ message: "name, description, price are required" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        image: image || null,
        authorId: user.id,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Create product error" });
  }
});

// UPDATE product (admin only)
router.put("/:id", async (req: any, res) => {
  try {
    const user = getUserFromToken(req);

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin only" });
    }

    const { name, description, price, image } = req.body;

    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: {
        name,
        description,
        price: Number(price),
        image: image || null,
      },
    });

    res.json(product);
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Update product error" });
  }
});

// DELETE product (admin only)
router.delete("/:id", async (req: any, res) => {
  try {
    const user = getUserFromToken(req);

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin only" });
    }

    await prisma.product.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Delete product error" });
  }
});

export default router;