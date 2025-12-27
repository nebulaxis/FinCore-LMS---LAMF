import { Router } from "express";
import { ApplicationService } from "./application.service";
import { db } from "../../db";
import { loans } from "@shared/schema";

const router = Router();

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

/* GET ALL */
router.get("/", async (_req, res, next) => {
  try {
    res.json(await ApplicationService.getAll());
  } catch (err) {
    next(err);
  }
});

/* CREATE */
router.post("/", async (req, res, next) => {
  try {
    const app = await ApplicationService.create(req.body);
    res.status(201).json(app);
  } catch (err) {
    next(err);
  }
});

/* SUBMIT */
router.post("/:id/submit", async (req, res, next) => {
  try {
    res.json(await ApplicationService.submit(req.params.id));
  } catch (err) {
    next(err);
  }
});


router.put("/:id/status", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await ApplicationService.updateStatus(id, status);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});


/* APPROVE */
router.post("/:id/approve", async (req, res, next) => {
  try {
    const updated = await ApplicationService.approve(
      req.params.id,
      "admin@nbfc.com"
    );

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

/* REJECT */
router.post("/:id/reject", async (req, res, next) => {
  try {
    res.json(await ApplicationService.reject(req.params.id));
  } catch (err) {
    next(err);
  }
});

/* DISBURSE */
router.post("/:id/disburse", async (req, res, next) => {
  try {
    const app = await ApplicationService.disburse(req.params.id);

    const today = new Date();

    await db.insert(loans).values({
      applicationId: app.id,
      sanctionedAmount: app.requestedAmount,
      outstandingAmount: app.requestedAmount,
      status: "ACTIVE",
      riskStatus: "NORMAL",
      startDate: today,
      nextEmiDate: addMonths(today, 1),
      disbursedAt: today,
    });

    res.json(app);
  } catch (err) {
    next(err);
  }
});

export default router;
