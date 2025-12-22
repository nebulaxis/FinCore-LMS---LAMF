import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search loans, applications, or collateral..."
            className="pl-9 bg-muted/40 border-none focus-visible:ring-1 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full border border-background"></span>
        </Button>
        
        <div className="h-8 w-px bg-border mx-1"></div>
        
        <div className="flex items-center gap-3 pl-1">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">Admin User</p>
            <p className="text-xs text-muted-foreground mt-1">Credit Manager</p>
          </div>
          <Avatar className="h-9 w-9 border-2 border-primary/10">
            <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
