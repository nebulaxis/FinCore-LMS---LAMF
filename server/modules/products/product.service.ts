import { db } from "../../db";
import { loanProducts } from "@shared/schema";
import { eq } from "drizzle-orm";

/* ----------- LIST ----------- */
export async function getProducts() {
  return db.select().from(loanProducts);
}

/* ----------- GET ONE ----------- */
export async function getProductById(id: string) {
  const [p] = await db
    .select()
    .from(loanProducts)
    .where(eq(loanProducts.id, id));

  return p;
}

/* ----------- CREATE ----------- */
export async function createProduct(data: {
  name: string;
  interestRate: number;
  maxLtv: number;
  minAmount: number;
  maxAmount: number;
  tenureMonths: number;
}) {
  const [product] = await db
    .insert(loanProducts)
    .values({
      name: data.name,
      interestRate: data.interestRate,
      maxLtv: data.maxLtv,
      minAmount: data.minAmount,
      maxAmount: data.maxAmount,
      tenureMonths: data.tenureMonths,
      createdAt: new Date(),
    })
    .returning();

  return product;
}

/* ----------- UPDATE ----------- */
export async function updateProduct(
  id: string,
  data: Partial<typeof loanProducts.$inferInsert>
) {
  const [updated] = await db
    .update(loanProducts)
    .set(data)
    .where(eq(loanProducts.id, id))
    .returning();

  return updated;
}

/* ----------- DELETE ----------- */
export async function deleteProduct(id: string) {
  await db.delete(loanProducts).where(eq(loanProducts.id, id));
}
