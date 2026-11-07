import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useStore } from "@/lib/core/store";
import { listModules } from "@/lib/core/registry";
import { BarChart3, Users, Building, GraduationCap, Briefcase } from "lucide-react";

export const Route = createFileRoute("/relatorios")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sgde-auth-v1");
      if (!stored) throw redirect({ to: "/login" });
      const user = JSON.parse(stored);
      if (user.role !== "admin") throw redirect({ to: "/login" });
    }
  },
  component: RelatoriosPage,
});

function RelatoriosPage() {
  const { getRecords } = useStore();
  const profs = getRecords("profissionais");
  const alunos = getRecords("alunos");
  const escolas = getRecords("instituicoes");

  // Métricas de Vínculo
  const vinculosCount = profs.reduce((acc, p) => {
    const v = p.vinculo || "Outros";
    acc[v] = (acc[v] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Métricas de Cargos
  const cargosCount = profs.reduce((acc, p) => {
    const c = p.cargo || "Não Informado";
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Profissionais por Escola
  const profsPorEscola = profs.reduce((acc, p) => {
    const esc = p.lotacao_escola || "Sem Lotação";
    acc[esc] = (acc[esc] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AppShell
      title="Relatórios & Indicadores da Rede"
      subtitle="Dados consolidados e cruzamentos entre Profissionais, Escolas e Alunos"
    >
      <div className="space-y-6">
        {/* Cards Resumo */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Profissionais</span>
              <Users className="size-4 text-primary" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold">{profs.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Servidores cadastrados no sistema</p>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Escolas Ativas</span>
              <Building className="size-4 text-emerald-600" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold">{escolas.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Unidades de ensino registradas</p>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Alunos Matriculados</span>
              <GraduationCap className="size-4 text-indigo-600" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold">{alunos.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Discentes na base de dados</p>
          </div>
        </div>

        {/* Tabelas de Distribuição */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Vínculos */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="font-display font-semibold text-base mb-4 flex items-center gap-2">
              <Briefcase className="size-4 text-primary" /> Distribuição por Tipo de Vínculo
            </h3>
            <div className="space-y-3">
              {Object.entries(vinculosCount).map(([vinculo, count]) => {
                const perc = profs.length ? Math.round((count / profs.length) * 100) : 0;
                return (
                  <div key={vinculo} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{vinculo}</span>
                      <span>{count} ({perc}%)</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-primary" style={{ width: `${perc}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lotação por Escola */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="font-display font-semibold text-base mb-4 flex items-center gap-2">
              <Building className="size-4 text-primary" /> Profissionais por Lotação
            </h3>
            <div className="space-y-3">
              {Object.entries(profsPorEscola).map(([escola, count]) => (
                <div key={escola} className="flex items-center justify-between rounded-lg border p-3 text-xs">
                  <span className="font-medium text-foreground">{escola}</span>
                  <span className="font-bold text-primary">{count} profissional(is)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
