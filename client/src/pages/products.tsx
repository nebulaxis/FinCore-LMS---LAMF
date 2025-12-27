import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, LoanProduct } from "@/lib/api";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Percent, Clock, DollarSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";



const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  interestRate: z.coerce.number().min(0).max(100),
  maxLtv: z.coerce.number().min(0).max(100),
  minAmount: z.coerce.number().min(1000),
  maxAmount: z.coerce.number().min(1000),
  tenureMonths: z.coerce.number().min(1),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function Products() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.getProducts(),
  });

  const createMutation = useMutation({
    mutationFn: (data: ProductFormValues) => api.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsOpen(false);
      toast({
        title: "Product Created",
        description: "New loan product has been successfully added.",
      });
    },
  });


const deleteMutation = useMutation({
  mutationFn: (id: string) => api.deleteProduct(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    toast({
      title: "Deleted",
      description: "Product successfully deleted",
    });
  },
});



  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      interestRate: 10,
      maxLtv: 50,
      minAmount: 50000,
      maxAmount: 1000000,
      tenureMonths: 12,
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    createMutation.mutate(data);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Loan Products</h1>
            <p className="text-muted-foreground mt-2">Manage your lending offerings and terms.</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg hover:shadow-xl transition-all">
                <Plus className="h-4 w-4" /> Create Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Loan Product</DialogTitle>
                <DialogDescription>
                  Define the terms for a new Loan Against Mutual Fund product.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" {...form.register("name")} />
                  {form.formState.errors.name && <span className="text-destructive text-xs">{form.formState.errors.name.message}</span>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input id="interestRate" type="number" step="0.1" {...form.register("interestRate")} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="maxLtv">Max LTV (%)</Label>
                    <Input id="maxLtv" type="number" {...form.register("maxLtv")} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="minAmount">Min Amount</Label>
                    <Input id="minAmount" type="number" {...form.register("minAmount")} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="maxAmount">Max Amount</Label>
                    <Input id="maxAmount" type="number" {...form.register("maxAmount")} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tenureMonths">Tenure (Months)</Label>
                  <Input id="tenureMonths" type="number" {...form.register("tenureMonths")} />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creating..." : "Create Product"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-[200px] w-full rounded-xl" />)
          ) : (
            products?.map((product) => (
              <Card key={product.id} className="group hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span className="text-xl group-hover:text-primary transition-colors">{product.name}</span>
                  </CardTitle>
                  <CardDescription>Product ID: {product.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Percent className="h-3 w-3" /> Interest
                      </span>
                      <span className="font-mono font-bold text-lg">{product.interestRate}%</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Tenure
                      </span>
                      <span className="font-mono font-bold text-lg">{product.tenureMonths}m</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-3 w-3" /> Max LTV
                      </span>
                      <span className="font-mono font-bold text-lg">{product.maxLtv}%</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">Range</span>
                      <span className="font-mono text-sm">
                        {(product.minAmount/1000).toFixed(0)}k - {(product.maxAmount/100000).toFixed(1)}L
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 border-t p-4 flex justify-between items-center">
                   <span className="text-xs font-medium text-muted-foreground">Active Product</span>
                   <Button variant="ghost" size="sm" className="h-8">Details</Button>
                </CardFooter>

                <Button
      variant="destructive"
      size="sm"
      onClick={() => deleteMutation.mutate(product.id)}
    >
      Delete
    </Button>

              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
