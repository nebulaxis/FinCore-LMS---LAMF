export interface Collateral {
  id: string;
  fundName: string;
  isin: string;
  units: number;
  nav: number;
  pledgedValue: number;
  loanId: string;
}
