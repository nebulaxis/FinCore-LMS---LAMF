import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, LoanApplicationStatus } from "@/lib/api";
import { Layout } from "@/components/layout/Layout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plus, Check, Banknote, X, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<LoanApplicationStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-800",
  SUBMITTED: "bg-blue-100 text-blue-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  DISBURSED: "bg-indigo-100 text-indigo-800",
  CLOSED: "bg-gray-100 text-gray-800",
};

export default function Applications() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: () => api.getApplications(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: LoanApplicationStatus }) => 
      api.updateApplicationStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] }); // Invalidate stats too
      toast({
        title: "Status Updated",
        description: `Application marked as ${variables.status}`,
      });
    },
  });

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Loan Applications</h1>
            <p className="text-muted-foreground mt-2">Track and manage incoming loan requests.</p>
          </div>
          <Link href="/new-application">
            <Button className="gap-2 shadow-lg">
              <Plus className="h-4 w-4" /> New Application
            </Button>
          </Link>
        </div>

        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">Loading...</TableCell>
                </TableRow>
              ) : applications?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No applications found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                applications?.map((app) => (
                  <TableRow key={app.id} className="group">
                    <TableCell className="font-mono text-xs">{app.id}</TableCell>
                    <TableCell className="font-medium">{app.applicantName}</TableCell>
                    <TableCell className="font-mono">₹{app.requestedAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{app.productId}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[app.status]}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          
                          {app.status === 'SUBMITTED' && (
                            <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: app.id, status: 'APPROVED' })}>
                              <Check className="mr-2 h-4 w-4" /> Approve
                            </DropdownMenuItem>
                          )}
                          
                          {app.status === 'APPROVED' && (
                            <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: app.id, status: 'DISBURSED' })}>
                              <Banknote className="mr-2 h-4 w-4" /> Disburse
                            </DropdownMenuItem>
                          )}
                          
                          {(app.status === 'SUBMITTED' || app.status === 'APPROVED') && (
                            <DropdownMenuItem className="text-destructive">
                              <X className="mr-2 h-4 w-4" /> Reject
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
