import { Router } from "express";
import { getDashboardStats, getDisbursementTrends,  getCollateralRisk} from "./dashboard.service";

const router = Router();

// GET main dashboard stats
// dashboard.routes.ts
router.get("/", async (_req, res, next) => {
  try {
    const stats = await getDashboardStats();
    const riskPercent = await getCollateralRisk(); // from dashboard.service.ts
    res.json({
      ...stats,
      riskPercent: Math.round(riskPercent * 100) / 100, // 2 decimals
    });
  } catch (err) {
    next(err);
  }
});



// GET disbursement trends (monthly)
router.get("/disbursement-trends", async (_req, res, next) => {
  try {
    const data = await getDisbursementTrends();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
