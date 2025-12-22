import { db } from "../../db";
import { loanApplications } from "@shared/schema";
import { eq } from "drizzle-orm";

export class ApplicationService {


  // CREATE
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





  static async getAll() {
  return await db.query.loanApplications.findMany({
    orderBy: (apps, { desc }) => [desc(apps.createdAt)],
  });
}


  // GET BY ID
  static async getById(id: string) {
    const app = await db.query.loanApplications.findFirst({
      where: eq(loanApplications.id, id),
    });

    if (!app) {
      throw { statusCode: 404, message: "Application not found" };
    }

    return app;
  }

  // SUBMIT
  static async submit(id: string) {
    const app = await this.getById(id);

    if (app.status !== "DRAFT") {
      throw {
        statusCode: 400,
        message: "Only DRAFT applications can be submitted",
      };
    }

    const [updated] = await db
      .update(loanApplications)
      .set({ status: "SUBMITTED" })
      .where(eq(loanApplications.id, id))
      .returning();

    return updated;
  }

  // APPROVE
  static async approve(id: string, approvedBy: string) {
    const app = await this.getById(id);

    if (app.status !== "SUBMITTED") {
      throw {
        statusCode: 400,
        message: "Only SUBMITTED applications can be approved",
      };
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

  // REJECT
  static async reject(id: string) {
    const app = await this.getById(id);

    if (app.status !== "SUBMITTED") {
      throw {
        statusCode: 400,
        message: "Only SUBMITTED applications can be rejected",
      };
    }

    const [updated] = await db
      .update(loanApplications)
      .set({ status: "REJECTED" })
      .where(eq(loanApplications.id, id))
      .returning();

    return updated;
  }
}
