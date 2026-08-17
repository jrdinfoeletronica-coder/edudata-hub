import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Boxes,
  Upload,
  Download,
  FileBarChart,
  Printer,
  ShieldCheck,
  Settings,
  Search,
  GraduationCap,
  UserCog,
} from "lucide-react";
import { listModules } from "@/lib/core/registry";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: string;
  icon: typeof Users;
  soon?: boolean;
}

function useNav(): { section: string; items: NavItem[] }[] {
  const modules = listModules();
  return [
    { section: "Visão geral", items: [{ label: "Dashboard", to: "/", icon: LayoutDashboard }, { label: "Busca global", to: "/busca", icon: Search }] },
    {
      section: "Cadastros",
      items: [
        ...modules.map((m) => ({ label: m.name, to: `/modulos/${m.id}`, icon: Users })),
        { label: "Instituições de Ensino", to: "/em-preparacao", icon: Building2, soon: true },
        { label: "Cadastros auxiliares", to: "/em-preparacao", icon: Boxes, soon: true },
      ],
    },
    {
      section: "Operações",
      items: [
        { label: "Importação", to: "/importacao", icon: Upload },
        { label: "Exportação", to: "/exportacao", icon: Download },
        { label: "Impressões", to: "/impressoes", icon: Printer },
        { label: "Relatórios", to: "/relatorios", icon: FileBarChart },
      ],
    },
    {
      section: "Administração",
      items: [
        { label: "Gerenciador de modelos", to: "/modelos", icon: Boxes },
        { label: "Auditoria", to: "/auditoria", icon: ShieldCheck },
        { label: "Usuários e permissões", to: "/usuarios", icon: UserCog },
        { label: "Configurações", to: "/configuracoes", icon: Settings },
      ],
    },
  ];
}

export function AppShell({
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
  const nav = useNav();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="no-print hidden bg-sidebar text-sidebar-foreground lg:flex lg:h-screen lg:flex-col lg:sticky lg:top-0">
        <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
          <span className="flex size-10 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <GraduationCap className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold">SGDE</p>
            <p className="text-xs text-sidebar-foreground/70">Gestão de Dados da Educação</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {nav.map((group) => (
            <div key={group.section} className="mb-5">
              <p className="px-2 pb-2 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-sidebar-foreground/50">
                {group.section}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
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
                        {item.soon && (
                          <span className="ml-auto rounded bg-sidebar-border px-1.5 py-0.5 text-[0.6rem] uppercase">
                            futuro
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="border-t border-sidebar-border px-5 py-3 text-xs text-sidebar-foreground/60">
          Arquitetura modular · v1.0
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
            {nav.flatMap((g) => g.items).map((i) => (
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
