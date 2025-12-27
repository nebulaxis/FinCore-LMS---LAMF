import { db } from "../../db";
import { loans, loanApplications, collaterals, InsertCollateral } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

/* ===============================
   GET ACTIVE (DISBURSED) LOANS
================================ */
export async function getLoans() {
  const activeLoans = await db.query.loans.findMany({
    where: eq(loans.status, "DISBURSED"),
    orderBy: (l, { desc }) => [desc(l.createdAt)],
  });

  return activeLoans.map((l) => ({
    id: l.id,
    applicationId: l.applicationId,
    sanctionedAmount: l.sanctionedAmount,
    outstandingAmount: l.outstandingAmount,
    status: l.status,
    startDate: l.startDate ? l.startDate.toISOString() : null,
    nextEmiDate: l.nextEmiDate ? l.nextEmiDate.toISOString() : null,
    createdAt: l.createdAt ? l.createdAt.toISOString() : null,
  }));
}

/* ===============================
   DISBURSE APPLICATION → CREATE LOAN
================================ */
export async function disburseApplication(applicationId: string) {
  // 1️⃣ Fetch application
  const app = await db.query.loanApplications.findFirst({
    where: eq(loanApplications.id, applicationId),
  });

  if (!app) throw { statusCode: 404, message: "Application not found" };
  if (app.status === "DISBURSED")
    throw { statusCode: 400, message: "Application already disbursed" };

  // 2️⃣ Update application status
  await db.update(loanApplications)
    .set({
      status: "DISBURSED",
      approvedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(loanApplications.id, applicationId));

  // 3️⃣ Create loan
  const startDate = new Date();
  const nextEmiDate = new Date();
  nextEmiDate.setMonth(nextEmiDate.getMonth() + 1);

  const [loanRecord] = await db.insert(loans)
    .values({
      applicationId: app.id,
      sanctionedAmount: app.requestedAmount,
      outstandingAmount: app.requestedAmount,
      status: "DISBURSED",
      startDate,
      nextEmiDate,
      disbursedAt: new Date(),
      createdAt: new Date(),
    })
    .returning();

  // ✅ Note: No default or auto-created collateral here.
  // Collateral should be added by user via separate API after disbursement.

  return { ok: true, loanId: loanRecord.id };
}