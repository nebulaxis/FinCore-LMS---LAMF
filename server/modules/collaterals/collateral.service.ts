import { db } from "../../db";
import { collaterals } from "@shared/schema";
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
  const pledgedValue = (data.units * data.nav).toFixed(2);

  const [created] = await db
    .insert(collaterals)
    .values({
      fundName: data.fundName,
      isin: data.isin,
      units: data.units.toString(),
      nav: data.nav.toString(),
      pledgedValue,
      loanId: data.loanId,
    })
    .returning();

  if (!created) {
    throw new Error("Collateral insert failed");
  }

  return {
    ...created,
    units: Number(created.units),
    nav: Number(created.nav),
    pledgedValue: Number(created.pledgedValue),
  };
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

  // ✅ returns single object | undefined
  return deleted;
}

/* ================= UPDATE ================= */
export async function updateCollateral(
  id: string,
  updates: { units: number; nav: number }
) {
  const pledgedValue = (updates.units * updates.nav).toFixed(2);

  const [updated] = await db
    .update(collaterals)
    .set({
      units: updates.units.toString(),
      nav: updates.nav.toString(),
      pledgedValue,
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
