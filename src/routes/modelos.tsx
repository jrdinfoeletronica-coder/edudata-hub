import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { listModules } from "@/lib/core/registry";
import { Boxes, Layers, CheckCircle2, History } from "lucide-react";

export const Route = createFileRoute("/modelos")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sgde-auth-v1");
      if (!stored) throw redirect({ to: "/login" });
      const user = JSON.parse(stored);
      if (user.role !== "admin") throw redirect({ to: "/login" });
    }
  },
  component: ModelosPage,
});

function ModelosPage() {
  const modules = listModules();

  return (
    <AppShell
      title="Gerenciador de Modelos de Dados"
      subtitle="Catálogo de entidades, dicionário de campos técnicos e histórico de versões dos modelos"
    >
      <div className="space-y-6">
        <div className="rounded-xl border bg-muted/20 p-5 text-sm text-muted-foreground">
          <p>
            ℹ️ A arquitetura do sistema é 100% modular. Cada nova planilha analisada gera um modelo independente com dicionário de campos oficiais preservados.
          </p>
        </div>

        <div className="space-y-6">
          {modules.map((m) => (
            <div key={m.id} className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <div className="border-b bg-muted/40 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      {m.model.code}
                    </span>
                    <h2 className="mt-1 font-display text-lg font-bold text-foreground">
                      {m.model.name}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Origem: {m.model.origin} · Versão ativa: {m.model.version}
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-semibold text-foreground">{m.model.fields.length} campos</span> mapeados
                  </div>
                </div>
              </div>

              {/* Tabela de Campos */}
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b bg-muted/20 font-semibold text-muted-foreground sticky top-0 bg-card">
                    <tr>
                      <th className="px-4 py-2.5">Código</th>
                      <th className="px-4 py-2.5">Nome Técnico</th>
                      <th className="px-4 py-2.5">Rótulo Amigável</th>
                      <th className="px-4 py-2.5">Tipo</th>
                      <th className="px-4 py-2.5">Obrigatório</th>
                      <th className="px-4 py-2.5">Grupo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-mono">
                    {m.model.fields.map((f) => (
                      <tr key={f.tech} className="hover:bg-muted/30">
                        <td className="px-4 py-2 font-semibold text-primary">{f.code}</td>
                        <td className="px-4 py-2 text-foreground">{f.tech}</td>
                        <td className="px-4 py-2 font-sans font-medium text-foreground">{f.label}</td>
                        <td className="px-4 py-2 text-muted-foreground">{f.type}</td>
                        <td className="px-4 py-2">
                          {f.required ? (
                            <span className="text-destructive font-semibold">Sim</span>
                          ) : (
                            <span className="text-muted-foreground">Não</span>
                          )}
                        </td>
                        <td className="px-4 py-2 font-sans text-muted-foreground">{f.group}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Histórico de Versões */}
              <div className="border-t bg-muted/10 p-4">
                <p className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
                  <History className="size-3.5 text-muted-foreground" /> Histórico de Versões
                </p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  {m.model.history.map((h, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="font-medium text-foreground">v{h.version} ({h.date}):</span>
                      <span>{h.changes}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
