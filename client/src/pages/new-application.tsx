import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const applicationSchema = z.object({
  productId: z.string().min(1, "Please select a product"),
  applicantName: z.string().min(3, "Name is required"),
  requestedAmount: z.coerce.number().positive("Amount must be positive"),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function NewApplication() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.getProducts(),
  });

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      productId: "",
      applicantName: "",
      requestedAmount: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: ApplicationFormValues) => api.createApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast({
        title: "Application Submitted",
        description: "Your loan application has been successfully created.",
      });
      setLocation('/applications');
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: ApplicationFormValues) => {
    createMutation.mutate(data);
  };

  const selectedProductId = form.watch("productId");
  const selectedProduct = products?.find(p => p.id === selectedProductId);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Loan Application</h1>
          <p className="text-muted-foreground mt-2">Create a new loan application for a customer.</p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className={cn("flex items-center gap-2", step >= 1 ? "text-primary" : "text-muted-foreground")}>
            <div className={cn("h-8 w-8 rounded-full flex items-center justify-center border-2", step >= 1 ? "border-primary bg-primary/10" : "border-muted")}>1</div>
            Select Product
          </div>
          <div className="h-px w-12 bg-border"></div>
          <div className={cn("flex items-center gap-2", step >= 2 ? "text-primary" : "text-muted-foreground")}>
            <div className={cn("h-8 w-8 rounded-full flex items-center justify-center border-2", step >= 2 ? "border-primary bg-primary/10" : "border-muted")}>2</div>
            Applicant Details
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          {step === 1 && (
            <div className="grid gap-4">
              <RadioGroup onValueChange={(val) => form.setValue("productId", val)} defaultValue={selectedProductId}>
                <div className="grid gap-4">
                  {products?.map((product) => (
                    <Label
                      key={product.id}
                      htmlFor={product.id}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <RadioGroupItem value={product.id} id={product.id} className="mt-1 md:mt-0" />
                        <div className="grid gap-1.5">
                          <div className="font-bold text-lg">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Rate: {product.interestRate}% • LTV: {product.maxLtv}% • Tenure: {product.tenureMonths}m
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 md:mt-0 font-mono text-sm md:text-right text-muted-foreground">
                        Min: ₹{(product.minAmount/1000).toFixed(0)}k<br/>
                        Max: ₹{(product.maxAmount/100000).toFixed(1)}L
                      </div>
                    </Label>
                  ))}
                </div>
              </RadioGroup>
              {form.formState.errors.productId && (
                <p className="text-destructive text-sm">{form.formState.errors.productId.message}</p>
              )}
              <div className="flex justify-end mt-4">
                <Button type="button" onClick={() => selectedProductId && setStep(2)} disabled={!selectedProductId}>
                  Next Step <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Applicant Information</CardTitle>
                <CardDescription>
                  Enter the borrower details and loan amount for {selectedProduct?.name}.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="applicantName">Applicant Name</Label>
                  <Input 
                    id="applicantName" 
                    placeholder="e.g. John Doe" 
                    {...form.register("applicantName")} 
                  />
                  {form.formState.errors.applicantName && <p className="text-destructive text-sm">{form.formState.errors.applicantName.message}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="requestedAmount">Requested Loan Amount (₹)</Label>
                  <Input 
                    id="requestedAmount" 
                    type="number" 
                    placeholder="e.g. 500000" 
                    {...form.register("requestedAmount")} 
                  />
                  {selectedProduct && (
                    <p className="text-xs text-muted-foreground">
                      Allowed range: ₹{selectedProduct.minAmount.toLocaleString()} - ₹{selectedProduct.maxAmount.toLocaleString()}
                    </p>
                  )}
                  {form.formState.errors.requestedAmount && <p className="text-destructive text-sm">{form.formState.errors.requestedAmount.message}</p>}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Submitting..." : (
                    <>Submit Application <CheckCircle2 className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </form>
      </div>
    </Layout>
  );
}
