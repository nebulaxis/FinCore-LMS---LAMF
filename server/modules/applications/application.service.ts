// application.service.ts
import { db } from "../../db";
import { loanApplications, loans, collaterals } from "@shared/schema";
import { eq } from "drizzle-orm";

export class ApplicationService {
  // ---------------- CREATE ----------------
  static async create(data: {
    applicantName: string;
    productId: string;
    requestedAmount: number;
  }) {
    const [app] = await db
      .insert(loanApplications)
      .values({
        applicantName: data.applicantName,
        productId: data.productId,
        requestedAmount: data.requestedAmount,
        status: "DRAFT",
        createdAt: new Date(),
      })
      .returning();

    return app;
  }

  // ---------------- GET ALL ----------------
  static async getAll() {
    return await db.query.loanApplications.findMany({
      orderBy: (apps, { desc }) => [desc(apps.createdAt)],
    });
  }

  // ---------------- GET BY ID ----------------
  static async getById(id: string) {
    const app = await db.query.loanApplications.findFirst({
      where: eq(loanApplications.id, id),
    });

    if (!app) {
      throw { statusCode: 404, message: "Application not found" };
    }

    return app;
  }

  // ---------------- UPDATE STATUS (generic) ----------------
  static async updateStatus(id: string, status: string) {
    const app = await this.getById(id);

    const [updated] = await db
      .update(loanApplications)
      .set({ status })
      .where(eq(loanApplications.id, id))
      .returning();

    return updated;
  }

  // ---------------- SUBMIT ----------------
  static async submit(id: string) {
    const app = await this.getById(id);

    if (app.status !== "DRAFT") {
      throw { statusCode: 400, message: "Only DRAFT can be submitted" };
    }

    const [updated] = await db
      .update(loanApplications)
      .set({ status: "SUBMITTED" })
      .where(eq(loanApplications.id, id))
      .returning();

    return updated;
  }

  // ---------------- APPROVE ----------------
  static async approve(id: string, approvedBy: string) {
    const app = await this.getById(id);

    if (app.status !== "SUBMITTED") {
      throw { statusCode: 400, message: "Only SUBMITTED can be approved" };
    }

    const [updated] = await db
      .update(loanApplications)
      .set({
        status: "APPROVED",
        approvedAt: new Date(),
        approvedBy,
      })
      .where(eq(loanApplications.id, id))
      .returning();

    return updated;
  }

  // ---------------- REJECT ----------------
  static async reject(id: string) {
    const app = await this.getById(id);

    if (app.status !== "SUBMITTED") {
      throw { statusCode: 400, message: "Only SUBMITTED can be rejected" };
    }

    const [updated] = await db
      .update(loanApplications)
      .set({ status: "REJECTED" })
      .where(eq(loanApplications.id, id))
      .returning();

    return updated;
  }

  // ---------------- DISBURSE ----------------
static async disburse(id: string) {
  const app = await this.getById(id);

  if (app.status !== "APPROVED") {
    throw { statusCode: 400, message: "Only APPROVED can be disbursed" };
  }

  // 1️⃣ Update application
  const [updatedApp] = await db.update(loanApplications)
    .set({ status: "DISBURSED" })
    .where(eq(loanApplications.id, id))
    .returning();

  // 2️⃣ Create loan record
const startDate = new Date();
const nextEmiDate = new Date();
nextEmiDate.setMonth(nextEmiDate.getMonth() + 1);

const [loan] = await db.insert(loans).values({
  applicationId: id,
  sanctionedAmount: app.requestedAmount,
  outstandingAmount: app.requestedAmount,
  status: "ACTIVE",
  startDate,      // <-- pass Date object directly
  nextEmiDate,    // <-- pass Date object directly
  createdAt: new Date(),
}).returning();


  // 3️⃣ Optional: create default collateral
  await db.insert(collaterals).values({
    loanId: loan.id,
    fundName: "Default Fund",
    isin: "DEFAULT123",
    units: 0,
    nav: 0,
    pledgedValue: app.requestedAmount,
  });

  return updatedApp;
}


}
