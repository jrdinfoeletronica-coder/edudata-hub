import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Building, Users, User, LogOut, GraduationCap, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/core/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function GestorShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const nav = [
    { label: "Dashboard da Escola", to: "/painel-gestor", icon: LayoutDashboard },
    { label: "Alunos Cadastrados", to: "/painel-gestor", icon: GraduationCap },
    { label: "Novo Aluno", to: "/painel-gestor/novo-aluno", icon: Users },
    { label: "Meu Cadastro Profissional", to: "/painel-gestor/meu-cadastro", icon: User },
  ];

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="no-print hidden bg-sidebar text-sidebar-foreground lg:flex lg:h-screen lg:flex-col lg:sticky lg:top-0">
        <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
          <span className="flex size-10 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Building className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold">Painel do Gestor</p>
            <p className="text-xs text-sidebar-foreground/70">INEP: {user?.inep}</p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {nav.map((item) => {
              const active = pathname === item.to;
              return (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                        : "text-sidebar-foreground/85 hover:bg-sidebar-accent/60",
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-foreground">
              <User className="h-5 w-5" />
            </div>
            <div className="flex flex-col text-sm">
              <span className="font-medium">{user?.name}</span>
              <span className="text-xs text-sidebar-foreground/60">Gestor Escolar</span>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start text-sidebar-foreground bg-sidebar-accent/30 hover:bg-sidebar-accent/60" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair do Sistema
          </Button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="no-print sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 lg:px-8">
            <div>
              <h1 className="font-display text-xl font-semibold">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-2">{actions}</div>
          </div>
          <div className="flex gap-1 overflow-x-auto border-t border-border px-3 py-2 lg:hidden">
            {nav.map((i) => (
              <Link
                key={i.label + i.to}
                to={i.to}
                className="whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted"
              >
                {i.label}
              </Link>
            ))}
          </div>
        </header>
        <main className="flex-1 px-5 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
