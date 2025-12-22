import { db } from "../../db";
import { loanApplications, loans, collaterals } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function getDashboard() {
  // total applications
  const applications = await db.select().from(loanApplications);

  // active loans
  const activeLoans = await db
    .select()
    .from(loans)
    .where(eq(loans.status, "ACTIVE"));

  // total disbursed amount
  const disbursedResult = await db
    .select()
    .from(loans);

  const totalDisbursed = disbursedResult.reduce(
    (sum, loan) => sum + Number(loan.sanctionedAmount ?? 0),
    0
  );

  // total collateral value
  const collateralResult = await db.select().from(collaterals);

  const totalCollateral = collateralResult.reduce(
    (sum, c) => sum + Number(c.pledgedValue ?? 0),
    0
  );

  return {
    totalApplications: applications.length,
    activeLoans: activeLoans.length,
    totalDisbursed,
    totalCollateral,
  };
}
