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
