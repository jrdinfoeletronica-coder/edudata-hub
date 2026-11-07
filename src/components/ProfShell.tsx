import type { ReactNode } from "react";
import { GraduationCap, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/core/auth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

export function ProfShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <header className="sticky top-0 z-10 border-b border-border bg-background/85 px-5 py-3 backdrop-blur lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GraduationCap className="size-5" />
            </span>
            <div className="leading-tight hidden sm:block">
              <p className="font-display text-sm font-semibold">SGDE</p>
              <p className="text-xs text-muted-foreground">Portal do Profissional</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="size-4" />
              <span className="hidden sm:inline">{user?.name}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 size-4" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 py-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-semibold">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
