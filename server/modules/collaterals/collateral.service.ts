import { db } from "../../db";
import { collaterals, InsertCollateral } from "@shared/schema";
import { eq } from "drizzle-orm";

/* ================= GET ALL ================= */
export async function getCollaterals() {
  const rows = await db.select().from(collaterals);

  return rows.map((c) => ({
    ...c,
    units: Number(c.units),
    nav: Number(c.nav),
    pledgedValue: Number(c.pledgedValue),
  }));
}

/* ================= ADD ================= */
export async function addCollateral(data: {
  loanId: string;
  fundName: string;
  isin: string;
  units: number;
  nav: number;
}) {
  const pledgedValue = data.units * data.nav;

  const [created] = await db
    .insert(collaterals)
    .values({
      loanId: data.loanId,
      fundName: data.fundName,
      isin: data.isin,
      units: data.units,        
      nav: data.nav,              
      pledgedValue,               
    })
    .returning();

  return created;
}


/* ================= GET BY LOAN ================= */
export async function getCollateralsByLoan(loanId: string) {
  const rows = await db
    .select()
    .from(collaterals)
    .where(eq(collaterals.loanId, loanId));

  return rows.map((c) => ({
    ...c,
    units: Number(c.units),
    nav: Number(c.nav),
    pledgedValue: Number(c.pledgedValue),
  }));
}

/* ================= DELETE ================= */
export async function deleteCollateral(id: string) {
  const [deleted] = await db
    .delete(collaterals)
    .where(eq(collaterals.id, id))
    .returning();

  return deleted;
}

/* ================= UPDATE ================= */
export async function updateCollateral(
  id: string,
  updates: { units: number; nav: number }
) {
  const pledgedValue = updates.units * updates.nav;

  const [updated] = await db
    .update(collaterals)
    .set({
      units: String(updates.units),
      nav: String(updates.nav),
      pledgedValue: String(pledgedValue),
    })
    .where(eq(collaterals.id, id))
    .returning();

  if (!updated) {
    throw new Error("Collateral not found");
  }

  return {
    ...updated,
    units: Number(updated.units),
    nav: Number(updated.nav),
    pledgedValue: Number(updated.pledgedValue),
  };
}
