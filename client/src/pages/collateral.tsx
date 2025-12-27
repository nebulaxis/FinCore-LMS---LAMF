import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ShieldCheck } from "lucide-react";

import { Collateral, AddCollateralPayload } from "@/types/collateral.types";


/* ================= TYPES ================= */

type Loan = {
  id: string;
  sanctionedAmount: number;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function CollateralPage() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    fundName: "",
    isin: "",
    units: 0,
    nav: 0,
    loanId: "",
  });

  /* ================= QUERIES ================= */

  const { data: collateral = [], isLoading } = useQuery<Collateral[]>({
    queryKey: ["collateral"],
    queryFn: api.getCollateral,
  });

  const { data: loans = [] } = useQuery<Loan[]>({
    queryKey: ["active-loans"],
    queryFn: api.getLoans,
  });

  /* ================= MUTATIONS ================= */

const addCollateral = useMutation<Collateral, Error, AddCollateralPayload>({
  mutationFn: api.addCollateral,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["collateral"] });
    setForm({ fundName: "", isin: "", units: 0, nav: 0, loanId: "" });
  },
});



  const deleteCollateral = useMutation({
    mutationFn: api.deleteCollateral,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collateral"] });
    },
  });

  /* ================= CALCULATIONS ================= */

  const chartData = collateral.map((c) => ({
    name: c.fundName,
    value: c.pledgedValue,
  }));

  const totalCollateralValue = collateral.reduce(
    (sum, c) => sum + c.pledgedValue,
    0
  );

  const totalLoanAmount = collateral.reduce((sum, c) => {
    const loan = loans.find((l) => l.id === c.loanId);
    return loan ? sum + loan.sanctionedAmount : sum;
  }, 0);

  const riskPercent =
    totalLoanAmount > 0
      ? (totalCollateralValue / totalLoanAmount) * 100
      : 0;

  /* ================= UI ================= */

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Collateral Management</h1>
          <p className="text-muted-foreground mt-2">
            Track pledged mutual funds and LTV ratios.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* ================= ADD FORM ================= */}
          <div className="md:col-span-2">
            <div className="rounded-xl border bg-card p-4 shadow-sm mb-6">
              <h3 className="font-semibold mb-4">Add Collateral</h3>

              <div className="grid md:grid-cols-5 gap-4">
                <Input
                  placeholder="Fund Name"
                  value={form.fundName}
                  onChange={(e) =>
                    setForm({ ...form, fundName: e.target.value })
                  }
                />

                <Input
                  placeholder="ISIN"
                  value={form.isin}
                  onChange={(e) =>
                    setForm({ ...form, isin: e.target.value })
                  }
                />

                <Input
                  placeholder="Units"
                  type="number"
                  value={form.units}
                  onChange={(e) =>
                    setForm({ ...form, units: Number(e.target.value) })
                  }
                />

                <Input
                  placeholder="NAV"
                  type="number"
                  value={form.nav}
                  onChange={(e) =>
                    setForm({ ...form, nav: Number(e.target.value) })
                  }
                />

                {/* ✅ Loan dropdown */}
                <select
                  value={form.loanId}
                  onChange={(e) =>
                    setForm({ ...form, loanId: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select Loan</option>
                  {loans.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.id.slice(0, 6)} – ₹{l.sanctionedAmount}
                    </option>
                  ))}
                </select>
              </div>

      <Button
  className="mt-4"
  disabled={!form.loanId}
  onClick={() =>
   addCollateral.mutate({
   fundName: form.fundName,
  isin: form.isin,
  units: Number(form.units),
  nav: Number(form.nav),
  loanId: form.loanId,
})
  }
>
  Save Collateral
</Button>



            </div>

            {/* ================= TABLE ================= */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="font-semibold">Pledged Assets</h3>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fund</TableHead>
                    <TableHead>ISIN</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>NAV</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead>Loan</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : collateral.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No collateral found
                      </TableCell>
                    </TableRow>
                  ) : (
                    collateral.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>{c.fundName}</TableCell>
                        <TableCell>{c.isin}</TableCell>
                        <TableCell>{c.units}</TableCell>
                        <TableCell>{c.nav}</TableCell>
                        <TableCell className="text-right font-bold">
                          ₹{c.pledgedValue.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs">
                          {c.loanId.slice(0, 6)}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteCollateral.mutate(c.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* ================= CHART + RISK ================= */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Composition</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} dataKey="value" innerRadius={60}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `₹${Number(v).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                  <ShieldCheck className="h-5 w-5" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{riskPercent.toFixed(1)}%</p>
                <p className="text-sm opacity-80">
                  {riskPercent < 50
                    ? "All pledged assets are within safe limits."
                    : riskPercent < 80
                    ? "Collateral coverage is moderate."
                    : "High risk! Collateral insufficient."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
