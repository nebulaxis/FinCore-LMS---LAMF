import { db } from "../../db";
import { loanProducts } from "@shared/schema";

export async function getProducts() {
  return db.select().from(loanProducts);
}

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
      interestRate: data.interestRate, // ✅ camelCase
      maxLtv: data.maxLtv,             // ✅ camelCase
      minAmount: data.minAmount,       // ✅ camelCase
      maxAmount: data.maxAmount,       // ✅ camelCase
      tenureMonths: data.tenureMonths, // ✅ camelCase
    })
    .returning(); // returns inserted row

  return product;
}
