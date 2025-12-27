// server/seed.ts
import { db } from "./db";
import {
  users,
  loanProducts,
  loanApplications,
  loans,
  collaterals,
  InsertCollateral
} from "../shared/schema";
import { v4 as uuidv4 } from "uuid";

const today = new Date();

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export async function seed() {
  console.log("🌱 Seeding database...");

  // ---------- USERS ----------
  const [adminUser] = await db.insert(users).values({
    username: "admin",
    password: "admin123",
  }).returning();

  // ---------- PRODUCTS ----------
  const [product] = await db.insert(loanProducts).values({
    name: "Equity LAMF",
    interestRate: 10,
    maxLtv: 50,
    minAmount: 50000,
    maxAmount: 5000000,
    tenureMonths: 12,
  }).returning();

  // ---------- APPLICATIONS ----------
  const [app] = await db.insert(loanApplications).values({
    applicantName: "John Doe",
    productId: product.id,
    requestedAmount: 500000,
    status: "APPROVED",
    approvedAt: new Date(),
    approvedBy: adminUser.username,

    // ✅ Collateral info
    pledgedFundName: "HDFC Equity Fund",
    pledgedISIN: "INE123A01016",
    pledgedUnits: 2000,
    pledgedNAV: 500,
  }).returning();

  // ---------- LOANS ----------
  const [loan] = await db.insert(loans).values({
    applicationId: app.id,
    sanctionedAmount: app.requestedAmount,
    outstandingAmount: app.requestedAmount,
    status: "DISBURSED",
    riskStatus: "NORMAL",
    startDate: today,
    nextEmiDate: addMonths(today, 1),
    disbursedAt: today,
  }).returning();

  // ---------- COLLATERALS ----------
  if (
    app.pledgedFundName &&
    app.pledgedISIN &&
    app.pledgedUnits != null &&
    app.pledgedNAV != null
  ) {
    const collateralData: InsertCollateral = {
  id: uuidv4(),            // ✅ optional but safer
  loanId: loan.id,
  fundName: app.pledgedFundName,
  isin: app.pledgedISIN,
  units: app.pledgedUnits,
  nav: app.pledgedNAV,
  pledgedValue: app.pledgedUnits * app.pledgedNAV,
};


    const [collateral] = await db.insert(collaterals)
      .values(collateralData)
      .returning();

    console.log("✅ Inserted collateral:", collateral);
  }

  console.log("✅ Seeding completed");
}

// ---------- RUNNER ----------
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Seed failed:", err);
      process.exit(1);
    });
}
