import { Router } from "express";
import { getCollaterals } from "./collateral.service";

const router = Router();

router.get("/", async (_req, res) => {
  res.json(await getCollaterals());
});

export default router;
