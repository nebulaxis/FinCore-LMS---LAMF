export async function getLoans() {
  return [
    {
      id: "LN001",
      applicationId: "APP1001",
      sanctionedAmount: 500000,
      outstandingAmount: 320000,
      status: "ACTIVE",
      startDate: new Date().toISOString(),
      nextEmiDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    },
  ];
}
