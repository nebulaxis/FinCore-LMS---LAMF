import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  CreditCard, 
  Landmark, 
  Settings,
  LogOut,
  PieChart
} from "lucide-react";

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Loan Products', href: '/products', icon: Package },
  { name: 'Applications', href: '/applications', icon: FileText },
  { name: 'Active Loans', href: '/loans', icon: CreditCard },
  { name: 'Collateral', href: '/collateral', icon: PieChart },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground w-64 border-r border-sidebar-border shadow-2xl">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <Landmark className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-mono text-xl font-bold tracking-tight">FinCore</span>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href} className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md translate-x-1"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1"
              )}>
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-sidebar-border">
        <button className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
