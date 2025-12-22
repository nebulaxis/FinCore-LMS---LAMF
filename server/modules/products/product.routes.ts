import { Router } from "express";
import { getProducts, createProduct } from "./product.service";

const router = Router();

router.get("/", async (_req, res) => {
  res.json(await getProducts());
});

router.post("/", async (req, res) => {
  const product = await createProduct(req.body);
  res.status(201).json(product);
});

export default router;
