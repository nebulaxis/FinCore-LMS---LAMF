<<<<<<< HEAD
# FinCore-LMS---LAMF
A LMS (Loan management system) for an NBFC (Non-Banking Financial Company) which is  only in the business of LAMF (Lending against Mutual Funds)


# LMS (Loan Management System) for LAMF NBFC

A full-stack Loan Management System (LMS) for a Non-Banking Financial Company (NBFC) specializing in **Lending Against Mutual Funds (LAMF)**.  
This project demonstrates **backend APIs, database management, frontend dashboard, and collateral management** with real data.

---

## **Demo**

- **Frontend Demo:** [https://your-frontend.onrender.com](https://your-frontend.onrender.com)  
- **Backend API:** [https://your-backend.onrender.com](https://your-backend.onrender.com)  
> The database is pre-seeded with sample users, loan products, applications, loans, and collaterals.

---

## **Project Overview**

The LMS system consists of the following modules:

1. **Loan Products** – Define and manage loan offerings.  
2. **Loan Applications** – Create and track loan applications (draft/submitted/approved/rejected).  
3. **Active Loans** – Monitor ongoing loans, repayment schedules, and outstanding amounts.  
4. **Collateral Management** – Track pledged mutual funds, calculate LTV ratios, and assess risk.  
5. **Dashboard** – Overview of lending performance, portfolio health, and trends.

---

## **Tech Stack**

- **Backend:** Node.js, Express, TypeScript, Drizzle ORM  
- **Frontend:** React, Vite, Tailwind CSS  
- **Database:** PostgreSQL  
- **Deployment:** Render (Backend + Postgres) / Vercel or static hosting (Frontend)  
- **Other Tools:** PM2 (optional for VPS deployment), dotenv for environment variables

---

## **Getting Started (Local Setup)**

1. **Clone the repo**

```bash
git clone https://github.com/yourusername/fintech-architect.git
cd fintech-architect





npm install





Configure environment variables

Create a .env file in server/:

DATABASE_URL=postgres://username:password@host:port/dbname
PORT=5000
NODE_ENV=development





Seed the database

npx ts-node-esm server/seed.ts





Start the backend server

npx ts-node-esm server/index.ts





cd frontend
npm install
npm run dev





Database Schema

Users: Admin and other users

Loan Products: Products available for lending

Loan Applications: Tracks each applicant’s loan request

Loans: Approved and disbursed loans

Collaterals: Pledged mutual fund units

All database tables are pre-seeded with sample data.







API Endpoints
Loan Applications

POST /api/v1/applications → Create new loan application
Request Body Example:

{
  "applicantName": "John Doe",
  "productId": "61b15d9d-a3c4-45af-b2f2-7875abb13c97",
  "requestedAmount": 50000
}
=======
# FinCore LMS - Loan Against Mutual Funds (LAMF) Demo

## Project Overview

FinCore LMS is a demo-level Loan Management System designed for a Non-Banking Financial Company (NBFC) specializing in **Loan Against Mutual Funds (LAMF)**.

In the LAMF model, borrowers pledge their mutual fund units as collateral to secure a loan. The loan amount is determined by the Net Asset Value (NAV) of the funds and a Loan-to-Value (LTV) ratio set by the lender.

This project demonstrates a clean, API-first architecture for managing the entire loan lifecycle:
1.  **Product Definition:** Creating loan schemes with specific interest rates and LTV limits.
2.  **Application Processing:** Managing the flow from Draft -> Submitted -> Approved -> Disbursed.
3.  **Loan Servicing:** Tracking active loans, outstanding amounts, and repayment schedules.
4.  **Collateral Management:** Monitoring the value of pledged mutual fund units.

**Note:** This is a **Frontend-Only Mockup**. All data is stored in the browser's local storage to simulate a persistent database for demonstration purposes. No real backend API is running.

## Tech Stack Used

*   **Frontend Framework:** React 18 (Vite)
*   **Styling:** Tailwind CSS v4 + Shadcn/UI (Radix Primitives)
*   **State Management:** TanStack Query (React Query)
*   **Forms:** React Hook Form + Zod Validation
*   **Routing:** Wouter
*   **Charts:** Recharts
*   **Icons:** Lucide React
*   **Language:** TypeScript

## System Design & Assumptions

*   **Single Tenant/Admin:** The system assumes a single "Credit Manager" admin user who handles all operations.
*   **Mock Backend:** A `mock-api.ts` service layer simulates REST API responses with artificial delays to demonstrate loading states.
*   **Data Persistence:** Uses `localStorage` so data survives page refreshes, providing a realistic demo experience.
*   **Collateral Valuation:** NAV values are static/mocked for this demo. In a real system, these would fetch real-time market data.

## API Endpoints (Simulated)

The `client/src/lib/mock-api.ts` file simulates the following REST-style endpoints:

### Products
*   `GET /products` - List all loan products
*   `POST /products` - Create a new loan product
    *   Body: `{ name, interestRate, maxLtv, minAmount, maxAmount, tenureMonths }`

### Applications
*   `GET /applications` - List all applications
*   `POST /applications` - Submit new application
    *   Body: `{ applicantName, productId, requestedAmount }`
*   `PATCH /applications/:id/status` - Update status (e.g., Approve, Disburse)

### Loans
*   `GET /loans` - List active loans

### Collateral
*   `GET /collateral` - List pledged assets

## Setup & Run Instructions

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run Development Server:**
    ```bash
    npm run dev:client
    ```

3.  **Open in Browser:**
    Access the application at `http://localhost:5000` (or the Replit Webview URL).

## Demo Walkthrough
1.  Go to **Products** and create a new Loan Product (e.g., "High Growth Equity Loan").
2.  Go to **Applications** or click "New Application" to simulate a customer request.
3.  Select the product you created, enter a name (e.g., "Sarah Connor"), and an amount.
4.  Submit the application. It will appear in the **Applications** list as `SUBMITTED`.
5.  Use the actions menu (...) on the application row to **Approve** and then **Disburse** the loan.
6.  Once disbursed, check the **Active Loans** tab to see the new loan account.
7.  Check the **Dashboard** to see the updated stats and charts.
>>>>>>> c3d3a2a (Add core features and layout for the loan management system)
