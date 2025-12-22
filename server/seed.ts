// server/seed.ts
import { db } from "./db";
import { users, loanProducts, loanApplications, loans, collaterals } from "../shared/schema";


export async function seed() {
  console.log(" Seeding database...");

  // ---------- USERS ----------
  const [adminUser] = await db
    .insert(users)
    .values({
      username: "admin",
      password: "admin123",
    })
    .returning();

  // ---------- PRODUCTS ----------
  const [product] = await db
    .insert(loanProducts)
    .values({
      name: "Equity LAMF",
      interestRate: 10,
      maxLtv: 50,
      minAmount: 50000,
      maxAmount: 5000000,
      tenureMonths: 12,
    })
    .returning();

  // ---------- APPLICATIONS ----------
  const [app] = await db
    .insert(loanApplications)
    .values({
      applicantName: "John Doe",
      productId: product.id,
      requestedAmount: 500000,
      status: "APPROVED",
      approvedAt: new Date(),
      approvedBy: adminUser.username,
    })
    .returning();

  // ---------- LOANS ----------
  const [loan] = await db
    .insert(loans)
    .values({
      applicationId: app.id,
      sanctionedAmount: 500000,
      outstandingAmount: 480000,
      status: "DISBURSED",
      riskStatus: "NORMAL",
      disbursedAt: new Date(),
    })
    .returning();

  // ---------- COLLATERALS ----------
  await db.insert(collaterals).values({
    loanId: loan.id,
    fundName: "HDFC Equity Fund",
    isin: "INE123A01016",
    units: 2000,
    nav: 500,
    pledgedValue: 1000000,
  });

  console.log(" Seeding completed");
}

//  ESM-safe runner
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(" Seed failed:", err);
      process.exit(1);
    });
}
