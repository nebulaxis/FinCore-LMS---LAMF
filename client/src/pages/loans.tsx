import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Layout } from "@/components/layout/Layout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, AlertCircle } from "lucide-react";


export default function Loans() {
  const { data: loans, isLoading } = useQuery({
    queryKey: ['loans'],
    queryFn: () => api.getLoans(),
  });

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Loans</h1>
          <p className="text-muted-foreground mt-2">Monitor ongoing loan performance and repayment schedules.</p>
        </div>

        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[100px]">Loan ID</TableHead>
                <TableHead>App ID</TableHead>
                <TableHead>Sanctioned</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Next EMI</TableHead>
                <TableHead className="w-[150px]">Repayment %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">Loading...</TableCell>
                </TableRow>
              ) : loans?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No active loans found.
                  </TableCell>
                </TableRow>
              ) : (
                loans
  ?.filter((loan) =>
    String(loan.status) === "ACTIVE" ||
    String(loan.status) === "DISBURSED"
  )
  .map((loan) => {
                  const progress = ((loan.sanctionedAmount - loan.outstandingAmount) / loan.sanctionedAmount) * 100;
                  return (
                    <TableRow key={loan.id}>
                      <TableCell className="font-mono text-xs font-medium">{loan.id}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{loan.applicationId}</TableCell>
                      <TableCell className="font-mono">₹{loan.sanctionedAmount.toLocaleString()}</TableCell>
                      <TableCell className="font-mono font-bold text-primary">₹{loan.outstandingAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">
                          {loan.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(loan.startDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                           <Calendar className="h-3 w-3 text-muted-foreground" />
                           {new Date(loan.nextEmiDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Progress value={progress} className="h-2" />
                          <span className="text-[10px] text-muted-foreground text-right">{progress.toFixed(1)}% paid</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
