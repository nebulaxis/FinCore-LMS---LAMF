import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Layout } from "@/components/layout/Layout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, ShieldCheck } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Collateral() {
  const { data: collateral, isLoading } = useQuery({
    queryKey: ['collateral'],
    queryFn: () => api.getCollateral(),
  });

  const chartData = collateral?.map((c, i) => ({
    name: c.fundName,
    value: c.pledgedValue
  })) || [];

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collateral Management</h1>
          <p className="text-muted-foreground mt-2">Track pledged mutual funds and LTV ratios.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="p-6 border-b">
               <h3 className="font-semibold">Pledged Assets</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Fund Name</TableHead>
                  <TableHead>ISIN</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>NAV (₹)</TableHead>
                  <TableHead className="text-right">Pledged Value (₹)</TableHead>
                  <TableHead>Loan ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">Loading...</TableCell>
                  </TableRow>
                ) : collateral?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No collateral found.
                    </TableCell>
                  </TableRow>
                ) : (
                  collateral?.map((col) => (
                    <TableRow key={col.id}>
                      <TableCell className="font-medium">{col.fundName}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{col.isin}</TableCell>
                      <TableCell className="font-mono">{col.units}</TableCell>
                      <TableCell className="font-mono">{col.nav.toFixed(2)}</TableCell>
                      <TableCell className="font-mono text-right font-bold">₹{col.pledgedValue.toLocaleString()}</TableCell>
                      <TableCell className="font-mono text-xs">{col.loanId}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-6">
             <Card>
                <CardHeader>
                  <CardTitle>Portfolio Composition</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                             formatter={(value) => `₹${Number(value).toLocaleString()}`}
                             contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="mt-4 space-y-2">
                      {chartData.map((entry, index) => (
                         <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                               <span className="truncate max-w-[150px]">{entry.name}</span>
                            </div>
                            <span className="font-mono text-muted-foreground">₹{(entry.value/1000).toFixed(0)}k</span>
                         </div>
                      ))}
                   </div>
                </CardContent>
             </Card>

             <Card className="bg-primary text-primary-foreground border-none">
                <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5" />
                      Risk Assessment
                   </CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="space-y-4">
                      <div>
                         <p className="text-sm opacity-90">Overall Portfolio LTV</p>
                         <p className="text-3xl font-bold font-mono">47.5%</p>
                      </div>
                      <div className="text-sm opacity-80">
                         All pledged assets are within safe margin limits. No margin calls triggered.
                      </div>
                   </div>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
