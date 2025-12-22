import { Router } from "express";
import { getLoans } from "./loan.service";

const router = Router();

router.get("/", async (_req, res) => {
  res.json(await getLoans());
});

export default router;
