import { Router } from "express";
import {
  getCollaterals,
  addCollateral,
  deleteCollateral,
  updateCollateral,
} from "./collateral.service";

const router = Router();

/* ================= GET ALL ================= */
router.get("/", async (_req, res) => {
  try {
    const data = await getCollaterals();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch collaterals" });
  }
});

/* ================= ADD ================= */
router.post("/", async (req, res) => {
  try {
    const { fundName, isin, units, nav, loanId } = req.body;

    if (!fundName || !isin || !units || !nav || !loanId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const collateral = await addCollateral({
      fundName,
      isin,
      units: Number(units),
      nav: Number(nav),
      loanId,
    });

    res.status(201).json(collateral);
  } catch (err) {
    console.error("ADD COLLATERAL ERROR", err);
    res.status(500).json({ message: "Failed to add collateral" });
  }
});

/* ================= DELETE ================= */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteCollateral(id);

    // ✅ FIX HERE
    if (!deleted) {
      return res.status(404).json({ message: "Collateral not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE COLLATERAL ERROR", err);
    res.status(500).json({ message: "Failed to delete collateral" });
  }
});

/* ================= UPDATE ================= */
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { units, nav } = req.body;

    if (!units || !nav) {
      return res.status(400).json({ message: "Units and NAV required" });
    }

    const updated = await updateCollateral(id, {
      units: Number(units),
      nav: Number(nav),
    });

    res.json(updated);
  } catch (err) {
    console.error("UPDATE COLLATERAL ERROR", err);
    res.status(500).json({ message: "Failed to update collateral" });
  }
});

export default router;
