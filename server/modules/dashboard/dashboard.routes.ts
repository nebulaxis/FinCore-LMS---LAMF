import { Router } from "express";
import { getDashboard } from "./dashboard.service";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const stats = await getDashboard();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

export default router;
