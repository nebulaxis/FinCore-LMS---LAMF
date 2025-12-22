export function calculateLTV(outstanding: number, pledgedValue: number): number {
  return Number(((outstanding / pledgedValue) * 100).toFixed(2));
}

export function getRiskStatus(ltv: number, maxLtv: number) {
  return ltv > maxLtv ? "UNDER_COLLATERALIZED" : "NORMAL";
}
