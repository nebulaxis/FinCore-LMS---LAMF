import { Router } from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from "./product.service";

const router = Router();

/* ----------- GET ALL PRODUCTS ----------- */
router.get("/", async (_req, res, next) => {
  try {
    res.json(await getProducts());
  } catch (err) {
    next(err);
  }
});

/* ----------- GET SINGLE PRODUCT ----------- */
router.get("/:id", async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    next(err);
  }
});

/* ----------- CREATE PRODUCT ----------- */
router.post("/", async (req, res, next) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

/* ----------- UPDATE PRODUCT ----------- */
router.put("/:id", async (req, res, next) => {
  try {
    const updated = await updateProduct(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

/* ----------- DELETE PRODUCT ----------- */
router.delete("/:id", async (req, res, next) => {
  try {
    await deleteProduct(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
