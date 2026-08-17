import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Boxes, Upload, History, Database, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { listModules } from "@/lib/core/registry";
import { useStore } from "@/lib/core/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | SGDE — Gestão de Dados da Educação" },
      {
        name: "description",
        content:
          "Indicadores consolidados de todos os módulos: registros, importações e alterações recentes.",
      },
      { property: "og:title", content: "Dashboard | SGDE" },
      {
        property: "og:description",
        content: "Indicadores consolidados dos módulos de dados da Educação.",
      },
    ],
  }),
  component: Dashboard,
});

function Card({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: typeof Users;
}) {
  return (
    <div className="panel p-4">
      <div className="flex items-start justify-between">
        <p className="label-caps">{label}</p>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Dashboard() {
  const modules = listModules();
  const { records, imports, audit } = useStore();
  const totalRecords = Object.values(records).reduce((n, r) => n + r.length, 0);

  return (
    <AppShell
      title="Dashboard geral"
      subtitle="Indicadores consolidados de todos os módulos ativos da plataforma"
      actions={
        <Button asChild size="sm">
          <Link to="/importacao">
            <Upload className="size-4" /> Importar planilha
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card label="Módulos ativos" value={modules.length} hint="Novos módulos por planilha" icon={Boxes} />
        <Card label="Total de registros" value={totalRecords} hint="Somatório de todos os módulos" icon={Database} />
        {modules.map((m) => (
          <Card
            key={m.id}
            label={`Total de ${m.name.toLowerCase()}`}
            value={(records[m.id] ?? []).length}
            hint={`${m.model.code} · ${m.model.fields.length} campos`}
            icon={Users}
          />
        ))}
        <Card label="Importações realizadas" value={imports.length} hint="Histórico completo registrado" icon={History} />
      </div>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-2">
          <h2 className="font-display text-base font-semibold">Módulos da plataforma</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cada planilha analisada origina um módulo próprio, com modelo de dados, validações,
            importação, exportação e impressão independentes.
          </p>
          <ul className="mt-4 space-y-3">
            {modules.map((m) => (
              <li key={m.id} className="flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.model.code} · versão {m.model.version} · {m.model.fields.length} campos
                  </p>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/modulos/$moduleId" params={{ moduleId: m.id }}>
                    Abrir <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </li>
            ))}
            <li className="rounded-md border border-dashed border-border p-3 text-sm text-muted-foreground">
              Próximos módulos (Instituições, Turmas, Alunos, Matrículas) serão criados a partir das
              próximas planilhas fornecidas, sem reconstruir o sistema.
            </li>
          </ul>
        </div>

        <div className="panel p-5">
          <h2 className="font-display text-base font-semibold">Últimas importações</h2>
          {imports.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Nenhuma importação registrada.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {imports.slice(0, 4).map((i) => (
                <li key={i.id} className="text-sm">
                  <p className="font-medium">{i.file}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(i.datetime).toLocaleString("pt-BR")} · {i.imported} importados ·{" "}
                    {i.rejected} rejeitados
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    {i.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}

          <h2 className="mt-6 font-display text-base font-semibold">Últimas alterações</h2>
          {audit.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Nenhuma alteração registrada.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {audit.slice(0, 5).map((a) => (
                <li key={a.id} className="text-muted-foreground">
                  <span className="font-medium text-foreground">{a.operation}</span> em {a.moduleId} ·{" "}
                  {new Date(a.datetime).toLocaleString("pt-BR")}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </AppShell>
  );
}
