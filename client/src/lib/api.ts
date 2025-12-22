// =======================================================
// TYPES (same as mock-api.ts to avoid frontend break)
// =======================================================

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

export type ActiveLoan = {
  id: string;
  applicationId: string;
  sanctionedAmount: number;
  outstandingAmount: number;
  status: "ACTIVE" | "CLOSED";
  startDate: string;
  nextEmiDate: string;
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
  totalLoans: number;
  totalDisbursed: number;
  collateralValue: number;
};

// =======================================================
// BASE FETCH HELPER
// =======================================================

//const API_BASE = "/api/v1";


const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/v1";


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

  updateApplicationStatus: (
    id: string,
    status: LoanApplicationStatus
  ): Promise<LoanApplication> => {
    return apiFetch(`/applications/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  // ------------------ LOANS ------------------
  getLoans: (): Promise<ActiveLoan[]> => {
    return apiFetch("/loans");
  },

  // ------------------ COLLATERALS ------------------
  getCollateral: (): Promise<MutualFundCollateral[]> => {
    return apiFetch("/collaterals");
  },

  // ------------------ DASHBOARD ------------------
  getDashboardStats: (): Promise<DashboardStats> => {
    return apiFetch("/dashboard");
  },
};
