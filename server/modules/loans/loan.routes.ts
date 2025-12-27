import { Router } from "express";
import { getLoans, disburseApplication } from "./loan.service";
import { db } from "../../db";
import { loans } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

/* ===============================
   GET ACTIVE LOANS
================================ */
router.get("/", async (_req, res, next) => {
  try {
    res.json(await getLoans());
  } catch (err) {
    next(err);
  }
});

/* ===============================
   DISBURSE APPLICATION → CREATE LOAN
================================ */
router.post("/disburse/:applicationId", async (req, res, next) => {
  try {
    await disburseApplication(req.params.applicationId);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/* ===============================
   LOAN REPAYMENT
================================ */
router.post("/:id/repay", async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      throw { statusCode: 400, message: "Invalid repayment amount" };
    }

    const loan = await db.query.loans.findFirst({
      where: eq(loans.id, req.params.id),
    });

    if (!loan) {
      throw { statusCode: 404, message: "Loan not found" };
    }

    if (loan.status === "CLOSED") {
      throw { statusCode: 400, message: "Loan already closed" };
    }

    if (amount > loan.outstandingAmount) {
      throw {
        statusCode: 400,
        message: "Repayment exceeds outstanding amount",
      };
    }

    const newOutstanding = loan.outstandingAmount - amount;

    await db.update(loans)
      .set({
        outstandingAmount: Math.max(newOutstanding, 0),
        nextEmiDate:
          newOutstanding > 0
            ? new Date(
                new Date(loan.nextEmiDate).setMonth(
                  new Date(loan.nextEmiDate).getMonth() + 1
                )
              )
            : loan.nextEmiDate,
        status: newOutstanding <= 0 ? "CLOSED" : "DISBURSED",
        closedAt: newOutstanding <= 0 ? new Date() : null,
      })
      .where(eq(loans.id, req.params.id));

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
