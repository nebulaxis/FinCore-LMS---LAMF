import { Router } from "express";
import { ApplicationService } from "./application.service";

const router = Router();

// GET all
router.get("/", async (_req, res, next) => {
  try {
    res.json(await ApplicationService.getAll());
  } catch (err) {
    next(err);
  }
});

// ✅ CREATE (THIS FIXES 404)
router.post("/", async (req, res, next) => {
  try {
    const app = await ApplicationService.create(req.body);
    res.status(201).json(app);
  } catch (err) {
    next(err);
  }
});

export default router;
