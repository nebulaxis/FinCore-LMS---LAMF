// READ (backend → frontend)
export interface Collateral {
  id: string;
  fundName: string;
  isin: string;
  units: number;
  nav: number;
  pledgedValue: number;
  loanId: string;
}

// WRITE (frontend → backend)
export type AddCollateralPayload = {
  fundName: string;
  isin: string;
  units: number;
  nav: number;
  loanId: string;
};
