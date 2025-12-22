export interface LoanProduct {
  id: string;
  name: string;
  interestRate: number;
  maxLtv: number;
  minAmount: number;
  maxAmount: number;
  tenureMonths: number;
}
