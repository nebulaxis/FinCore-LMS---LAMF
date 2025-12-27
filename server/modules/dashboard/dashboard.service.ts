import { db } from "../../db";
import { loanApplications, loans, collaterals } from "@shared/schema";
import { eq, gt, sql } from "drizzle-orm";


import { getCollaterals } from "../collaterals/collateral.service";
import { getLoans } from "../loans/loan.service";

/* ================= TYPES ================= */
interface DashboardStats {
  totalApplications: number;
  activeLoans: number;
  totalDisbursed: number;
  totalCollateral: number;
}

interface TrendData {
  month: string;
  total: number;
}

/* ================= DASHBOARD STATS ================= */
export async function getDashboardStats(): Promise<DashboardStats> {
  // All applications
  const applications = await db.select().from(loanApplications);

  // Active loans -> only DISBURSED loans with outstandingAmount > 0
  const activeLoans = await db.select().from(loans).where(
    eq(loans.status, "DISBURSED")
  );

  // Total Disbursed -> sum of sanctionedAmount for DISBURSED loans
  const loanRows = await db.select().from(loans).where(eq(loans.status, "DISBURSED"));

  const totalDisbursed = loanRows.reduce(
    (sum, loan) => sum + Number(loan.sanctionedAmount ?? 0),
    0
  );

  // Collateral total
  const collateralRows = await db.select().from(collaterals);
  const totalCollateral = collateralRows.reduce(
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

/* ================= DISBURSEMENT TRENDS ================= */
export async function getDisbursementTrends(): Promise<TrendData[]> {
  // Aggregate by month
  const result = await db.execute(sql`
    SELECT 
      TO_CHAR(disbursed_at, 'Mon-YYYY') AS month,
      COALESCE(SUM(sanctioned_amount)::int, 0) AS total
    FROM loans
    WHERE status = 'DISBURSED' AND disbursed_at IS NOT NULL
    GROUP BY month, EXTRACT(YEAR FROM disbursed_at), EXTRACT(MONTH FROM disbursed_at)
    ORDER BY EXTRACT(YEAR FROM disbursed_at), EXTRACT(MONTH FROM disbursed_at)
  `);

  return result.rows.map((r: any) => ({
    month: r.month,
    total: Number(r.total),
  }));
}




// dashboard.service.ts
export async function getCollateralRisk() {
  const collateralsData = await getCollaterals();
  const loansData = await getLoans();

  let totalCollateral = 0;
  let totalLoan = 0;

  collateralsData.forEach((c) => {
    totalCollateral += c.pledgedValue;
    const loan = loansData.find((l) => l.id === c.loanId);
    totalLoan += loan?.sanctionedAmount || 0;
  });

  const riskPercent = totalLoan > 0 ? (totalCollateral / totalLoan) * 100 : 0;
  return riskPercent;
}
