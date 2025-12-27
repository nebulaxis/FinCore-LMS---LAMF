// =======================================================
// TYPES (same as mock-api.ts to avoid frontend break)
// =======================================================

import { Collateral, AddCollateralPayload } from "@/types/collateral.types";



export type LoanProduct = {
  id: string;
  name: string;
  interestRate: number;
  maxLtv: number;
  minAmount: number;
  maxAmount: number;
  tenureMonths: number;
};

export type LoanApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "DISBURSED"
  | "CLOSED";

export type LoanApplication = {
  id: string;
  applicantName: string;
  productId: string;
  requestedAmount: number;
  status: LoanApplicationStatus;
  createdAt: string;
  updatedAt?: string;
};

export type DisbursementTrend = {
  name: string;   // Jan, Feb
  total: number; // amount
};

export type ActiveLoan = {
  id: string;
  applicationId: string;
  sanctionedAmount: number;
  outstandingAmount: number;
  status: "ACTIVE" | "CLOSED"; // frontend expects ACTIVE/CLOSED
  startDate: string;           // ISO string
  nextEmiDate: string;         // ISO string
};

export type MutualFundCollateral = {
  id: string;
  loanId: string;
  fundName: string;
  isin: string;
  units: number;
  nav: number;
  pledgedValue: number;
};

export type DashboardStats = {
  totalApplications: number;
  activeLoans: number;
  totalDisbursed: number;
  totalCollateral: number;
  riskPercent: number;
};

// =======================================================
// BASE FETCH HELPER
// =======================================================

const API_BASE = import.meta.env.DEV
  ? "http://localhost:5000/api/v1" // dev server
  : "/api/v1"; 

async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "API Error");
  }

  return res.json();
}


// =======================================================
// API OBJECT (DROP-IN REPLACEMENT OF mock-api)
// =======================================================

export const api = {
  // ------------------ PRODUCTS ------------------
  getProducts: (): Promise<LoanProduct[]> => {
    return apiFetch("/products");
  },

  createProduct: (
    data: Omit<LoanProduct, "id">
  ): Promise<LoanProduct> => {
    return apiFetch("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },


  deleteProduct: (id: string): Promise<{ success: boolean }> => {
  return apiFetch(`/products/${id}`, {
    method: "DELETE",
  });
},

updateProduct: (id: string, data: Partial<LoanProduct>) => {
  return apiFetch(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
},



  // ------------------ APPLICATIONS ------------------
  getApplications: (): Promise<LoanApplication[]> => {
    return apiFetch("/applications");
  },


  createApplication: (
    data: Omit<
      LoanApplication,
      "id" | "status" | "createdAt" | "updatedAt"
    >
  ): Promise<LoanApplication> => {
    return apiFetch("/applications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },


  deleteApplication: (id: string) => {
  return apiFetch(`/applications/${id}`, {
    method: "DELETE",
  });
},

updateApplication: (id: string, data: Partial<LoanApplication>) => {
  return apiFetch(`/applications/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
},



updateApplicationStatus: (id: string, status: LoanApplicationStatus) =>
  apiFetch(`/applications/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  }),




// ------------------ LOANS ------------------
// ------------------ LOANS ------------------
getLoans: (): Promise<ActiveLoan[]> => {
  return apiFetch("/loans");
},

disburseLoan: (applicationId: string) => {
  return apiFetch(`/loans/disburse/${applicationId}`, {
    method: "POST",
  });
},

repayLoan: (id: string, amount: number) => {
  return apiFetch(`/loans/${id}/repay`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
},


// ------------------ COLLATERALS ------------------
// ------------------ COLLATERALS ------------------
getCollateral: (): Promise<MutualFundCollateral[]> => {
  return apiFetch("/collaterals");
},

addCollateral: (payload: AddCollateralPayload): Promise<MutualFundCollateral> => {
  return apiFetch("/collaterals", {
    method: "POST",
    body: JSON.stringify(payload),
  });
},

deleteCollateral: (id: string) => {
  return apiFetch(`/collaterals/${id}`, {
    method: "DELETE",
  });
},


// ------------------ DASHBOARD ------------------
getDashboardStats: async (): Promise<{
  totalApplications: number;
  activeLoans: number;
  totalDisbursed: number;
  totalCollateral: number;
  riskPercent: number; 
}> => {
  return apiFetch("/dashboard"); // backend route returns stats + riskPercent
},

getDisbursementTrends: (): Promise<DisbursementTrend[]> => {
  return apiFetch("/dashboard/disbursement-trends");
},
}