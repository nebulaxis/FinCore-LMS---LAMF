import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/dashboard";
import Products from "@/pages/products";
import Applications from "@/pages/applications";
import NewApplication from "@/pages/new-application";
import Loans from "@/pages/loans";
import Collateral from "@/pages/collateral";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/products" component={Products} />
      <Route path="/applications" component={Applications} />
      <Route path="/new-application" component={NewApplication} />
      <Route path="/loans" component={Loans} />
      <Route path="/collateral" component={Collateral} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
