import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  timestamp,
  numeric,
  uuid
} from "drizzle-orm/pg-core";

import {
  InferSelectModel,
  InferInsertModel,
} from "drizzle-orm";



/* ================= USERS ================= */

export const users = pgTable("users", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// ✅ Correct modern types
export type User = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;

/* ================= LOAN PRODUCTS ================= */

export const loanProducts = pgTable("loan_products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  interestRate: integer("interest_rate").notNull(), // ✅ FIX
  maxLtv: integer("max_ltv").notNull(),
  minAmount: integer("min_amount").notNull(),
  maxAmount: integer("max_amount").notNull(),
  tenureMonths: integer("tenure_months").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});


export type LoanProduct = InferSelectModel<typeof loanProducts>;
export type InsertLoanProduct = InferInsertModel<typeof loanProducts>;

/* ================= APPLICATIONS ================= */

export const loanApplications = pgTable("loan_applications", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  applicantName: text("applicant_name").notNull(),
  productId: varchar("product_id", { length: 36 }).notNull(),
  requestedAmount: integer("requested_amount").notNull(),
  status: text("status").notNull(), // DRAFT | SUBMITTED | APPROVED | REJECTED
  approvedAt: timestamp("approved_at"),
  approvedBy: text("approved_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),

  // ✅ Nullable collateral info
  pledgedFundName: text("pledged_fund_name"), // nullable by default
  pledgedISIN: text("pledged_isin"),         // nullable
  pledgedUnits: integer("pledged_units"),    // nullable
  pledgedNAV: integer("pledged_nav"),        // nullable
});

export type LoanApplication = InferSelectModel<typeof loanApplications>;
export type InsertLoanApplication =
  InferInsertModel<typeof loanApplications>;

/* ================= LOANS ================= */

export const loans = pgTable("loans", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  applicationId: varchar("application_id", { length: 36 }).notNull(),

  sanctionedAmount: integer("sanctioned_amount").notNull(),
  outstandingAmount: integer("outstanding_amount").notNull(),

  status: text("status").notNull(), // DISBURSED | CLOSED
  riskStatus: text("risk_status").default("NORMAL"),

  startDate: timestamp("start_date").notNull(),
  nextEmiDate: timestamp("next_emi_date").notNull(),

  disbursedAt: timestamp("disbursed_at"),
  closedAt: timestamp("closed_at"),
  closureReason: text("closure_reason"),

  createdAt: timestamp("created_at").defaultNow(),
});


export const emis = pgTable("emis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),

  loanId: varchar("loan_id").notNull(),

  dueDate: timestamp("due_date").notNull(),
  amount: integer("amount").notNull(),

  status: text("status")
    .default("PENDING"), // PENDING | PAID | OVERDUE

  paidAt: timestamp("paid_at"),
});



export type Loan = InferSelectModel<typeof loans>;
export type InsertLoan = InferInsertModel<typeof loans>;

/* ================= COLLATERALS ================= */

export const collaterals = pgTable("collaterals", {
  id: uuid("id").defaultRandom().primaryKey(),

  fundName: text("fund_name").notNull(),
  isin: text("isin").notNull(),

  units: integer("units").notNull(),          // ✅ INTEGER
  nav: numeric("nav").notNull(),              // ✅ DECIMAL
  pledgedValue: numeric("pledged_value").notNull(), // ✅ DECIMAL

  loanId: uuid("loan_id")
    .references(() => loans.id)
    .notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});
;

export type Collateral = InferSelectModel<typeof collaterals>;
export type InsertCollateral = InferInsertModel<typeof collaterals>;

