import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const queryClient = useQueryClient();

  // ---------------- STATS + RISK ----------------
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: api.getDashboardStats,
  });

  // ---------------- CHART ----------------
  const { data: chartData = [], isLoading: chartLoading } = useQuery({
    queryKey: ["disbursement-trends"],
    queryFn: api.getDisbursementTrends,
  });

  // ---------------- RECENT APPLICATIONS ----------------
  const { data: applications = [], isLoading: appsLoading } = useQuery({
    queryKey: ["recent-applications"],
    queryFn: api.getApplications,
  });

  // ---------------- ACTIVE LOANS ----------------
  const { data: activeLoans = [], isLoading: loansLoading } = useQuery({
    queryKey: ["active-loans"],
    queryFn: api.getLoans,
  });

  // ---------------- MUTATION: SUBMIT APPLICATION ----------------
  const submitApplication = useMutation({
    mutationFn: (id: string) => api.updateApplicationStatus(id, "SUBMITTED"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recent-applications"] });
    },
  });

  // ---------------- HELPERS ----------------
  const calculateRepaymentPercent = (loan: any) => {
    if (!loan.sanctionedAmount || !loan.outstandingAmount) return 0;
    const paid = loan.sanctionedAmount - loan.outstandingAmount;
    return (paid / loan.sanctionedAmount) * 100;
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-4">
          <StatCard title="Total Disbursed" value={stats?.totalDisbursed} loading={statsLoading} />
          <StatCard title="Active Loans" value={stats?.activeLoans} loading={statsLoading} />
          <StatCard title="Applications" value={stats?.totalApplications} loading={statsLoading} />
          <StatCard title="Collateral Value" value={stats?.totalCollateral} loading={statsLoading} />
          <StatCard title="Collateral Risk %" value={stats?.riskPercent} loading={statsLoading} />
        </div>

        {/* Disbursement Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Disbursement Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {chartLoading ? (
              <Skeleton className="h-72 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    dataKey="total"
                    type="monotone"
                    stroke="hsl(var(--primary))"
                    fillOpacity={0.3}
                    fill="hsl(var(--primary))"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {appsLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              applications
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((app) => (
                  <div
                    key={app.id}
                    className="flex justify-between py-2 border-b last:border-b-0 items-center"
                  >
                    <div>
                      <p className="font-medium">{app.applicantName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2 items-center">
                      <Badge>{app.status}</Badge>
                      {app.status === "DRAFT" && (
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                          onClick={() => submitApplication.mutate(app.id)}
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </div>
                ))
            )}
          </CardContent>
        </Card>

        {/* Active Loans */}
        <Card>
          <CardHeader>
            <CardTitle>Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            {loansLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <table className="w-full table-auto border-collapse border border-gray-300 text-left text-sm">
                <thead>
                  <tr>
                    <th className="border px-2 py-1">Loan ID</th>
                    <th className="border px-2 py-1">Application ID</th>
                    <th className="border px-2 py-1">Sanctioned</th>
                    <th className="border px-2 py-1">Outstanding</th>
                    <th className="border px-2 py-1">Status</th>
                    <th className="border px-2 py-1">Start Date</th>
                    <th className="border px-2 py-1">Next EMI</th>
                    <th className="border px-2 py-1">Repayment %</th>
                  </tr>
                </thead>
                <tbody>
                  {activeLoans.map((loan) => (
                    <tr key={loan.id}>
                      <td className="border px-2 py-1">{loan.id}</td>
                      <td className="border px-2 py-1">{loan.applicationId}</td>
                      <td className="border px-2 py-1">₹{loan.sanctionedAmount.toLocaleString()}</td>
                      <td className="border px-2 py-1">₹{loan.outstandingAmount.toLocaleString()}</td>
                      <td className="border px-2 py-1">{loan.status}</td>
                      <td className="border px-2 py-1">{new Date(loan.startDate).toLocaleDateString()}</td>
                      <td className="border px-2 py-1">{new Date(loan.nextEmiDate).toLocaleDateString()}</td>
                      <td className="border px-2 py-1">{calculateRepaymentPercent(loan).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

/* ================= STAT CARD ================= */
function StatCard({
  title,
  value,
  loading,
}: {
  title: string;
  value?: number;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? <Skeleton className="h-6 w-20" /> : value?.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
