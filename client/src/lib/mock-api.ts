import { useState, useEffect } from 'react';
import { z } from 'zod';

// --- Types ---

export type LoanProduct = {
  id: string;
  name: string;
  interestRate: number; // Percentage
  maxLtv: number; // Percentage (Loan to Value)
  minAmount: number;
  maxAmount: number;
  tenureMonths: number;
};

export type LoanApplicationStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'DISBURSED' | 'CLOSED';

export type LoanApplication = {
  id: string;
  applicantName: string;
  productId: string;
  requestedAmount: number;
  status: LoanApplicationStatus;
  createdAt: string;
  updatedAt: string;
};

export type ActiveLoan = {
  id: string;
  applicationId: string;
  sanctionedAmount: number;
  outstandingAmount: number;
  status: 'ACTIVE' | 'CLOSED';
  startDate: string;
  nextEmiDate: string;
};

export type MutualFundCollateral = {
  id: string;
  loanId: string;
  fundName: string;
  isin: string;
  units: number;
  nav: number; // Net Asset Value
  pledgedValue: number; // units * nav
};

// --- Initial Data (Mock) ---

const INITIAL_PRODUCTS: LoanProduct[] = [
  {
    id: 'prod_1',
    name: 'Standard Equity LAMF',
    interestRate: 10.5,
    maxLtv: 50,
    minAmount: 50000,
    maxAmount: 5000000,
    tenureMonths: 12,
  },
  {
    id: 'prod_2',
    name: 'Debt Fund Overdraft',
    interestRate: 8.5,
    maxLtv: 80,
    minAmount: 100000,
    maxAmount: 10000000,
    tenureMonths: 24,
  },
  {
    id: 'prod_3',
    name: 'Hybrid Flexi Loan',
    interestRate: 9.75,
    maxLtv: 65,
    minAmount: 25000,
    maxAmount: 2500000,
    tenureMonths: 36,
  }
];

const INITIAL_APPLICATIONS: LoanApplication[] = [
  {
    id: 'app_1',
    applicantName: 'John Doe',
    productId: 'prod_1',
    requestedAmount: 500000,
    status: 'DISBURSED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'app_2',
    applicantName: 'Alice Smith',
    productId: 'prod_2',
    requestedAmount: 1200000,
    status: 'APPROVED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'app_3',
    applicantName: 'Bob Wilson',
    productId: 'prod_1',
    requestedAmount: 200000,
    status: 'SUBMITTED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const INITIAL_LOANS: ActiveLoan[] = [
  {
    id: 'loan_1',
    applicationId: 'app_1',
    sanctionedAmount: 500000,
    outstandingAmount: 485000,
    status: 'ACTIVE',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    nextEmiDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28).toISOString(),
  }
];

const INITIAL_COLLATERAL: MutualFundCollateral[] = [
  {
    id: 'col_1',
    loanId: 'loan_1',
    fundName: 'HDFC Top 100 Fund',
    isin: 'INF179K01BE2',
    units: 1500,
    nav: 680.50,
    pledgedValue: 1020750, // 50% LTV of ~10L is 5L loan
  }
];

// --- Mock API Helpers ---

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockDB {
  products: LoanProduct[];
  applications: LoanApplication[];
  loans: ActiveLoan[];
  collateral: MutualFundCollateral[];

  constructor() {
    // Load from local storage or init
    const stored = localStorage.getItem('fincore_db');
    if (stored) {
      const parsed = JSON.parse(stored);
      this.products = parsed.products;
      this.applications = parsed.applications;
      this.loans = parsed.loans;
      this.collateral = parsed.collateral;
    } else {
      this.products = INITIAL_PRODUCTS;
      this.applications = INITIAL_APPLICATIONS;
      this.loans = INITIAL_LOANS;
      this.collateral = INITIAL_COLLATERAL;
      this.save();
    }
  }

  save() {
    localStorage.setItem('fincore_db', JSON.stringify({
      products: this.products,
      applications: this.applications,
      loans: this.loans,
      collateral: this.collateral,
    }));
  }

  // PRODUCTS
  async getProducts() {
    await delay(300);
    return this.products;
  }

  async createProduct(product: Omit<LoanProduct, 'id'>) {
    await delay(500);
    const newProduct = { ...product, id: `prod_${Date.now()}` };
    this.products.push(newProduct);
    this.save();
    return newProduct;
  }

  // APPLICATIONS
  async getApplications() {
    await delay(300);
    return this.applications;
  }

  async createApplication(data: Omit<LoanApplication, 'id' | 'status' | 'createdAt' | 'updatedAt'>) {
    await delay(500);
    const product = this.products.find(p => p.id === data.productId);
    if (!product) throw new Error("Invalid Product");

    if (data.requestedAmount < product.minAmount || data.requestedAmount > product.maxAmount) {
      throw new Error(`Amount must be between ${product.minAmount} and ${product.maxAmount}`);
    }

    const newApp: LoanApplication = {
      ...data,
      id: `app_${Date.now()}`,
      status: 'SUBMITTED', // Direct to submitted for demo flow
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.applications.unshift(newApp);
    this.save();
    return newApp;
  }

  async updateApplicationStatus(id: string, status: LoanApplicationStatus) {
    await delay(300);
    const app = this.applications.find(a => a.id === id);
    if (app) {
      app.status = status;
      app.updatedAt = new Date().toISOString();
      
      // If disbursed, create loan record
      if (status === 'DISBURSED') {
        const loan: ActiveLoan = {
          id: `loan_${Date.now()}`,
          applicationId: app.id,
          sanctionedAmount: app.requestedAmount,
          outstandingAmount: app.requestedAmount,
          status: 'ACTIVE',
          startDate: new Date().toISOString(),
          nextEmiDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        };
        this.loans.unshift(loan);
        
        // Mock collateral creation for demo
        const collateral: MutualFundCollateral = {
            id: `col_${Date.now()}`,
            loanId: loan.id,
            fundName: "Demo Mutual Fund Growth",
            isin: "INF123456789",
            units: 1000,
            nav: 120.5,
            pledgedValue: 120500
        };
        this.collateral.push(collateral);
      }
      
      this.save();
    }
    return app;
  }

  // LOANS
  async getLoans() {
    await delay(300);
    return this.loans;
  }

  // COLLATERAL
  async getCollateral() {
    await delay(300);
    return this.collateral;
  }

  async getDashboardStats() {
      await delay(400);
      const totalApplications = this.applications.length;
      const activeLoans = this.loans.filter(l => l.status === 'ACTIVE').length;
      const totalDisbursed = this.loans.reduce((acc, curr) => acc + curr.sanctionedAmount, 0);
      const totalCollateral = this.collateral.reduce((acc, curr) => acc + curr.pledgedValue, 0);
      
      return {
          totalApplications,
          activeLoans,
          totalDisbursed,
          totalCollateral
      };
  }
}

export const api = new MockDB();
