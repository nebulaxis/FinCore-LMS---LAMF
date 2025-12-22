import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen w-full bg-muted/30 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-8 relative">
          <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
