import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useStore } from "@/lib/core/store";
import { ShieldCheck, History } from "lucide-react";

export const Route = createFileRoute("/auditoria")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sgde-auth-v1");
      if (!stored) throw redirect({ to: "/login" });
      const user = JSON.parse(stored);
      if (user.role !== "admin") throw redirect({ to: "/login" });
    }
  },
  component: AuditoriaPage,
});

function AuditoriaPage() {
  const { audit } = useStore();

  return (
    <AppShell
      title="Trilha de Auditoria e Conformidade"
      subtitle="Registro imutável de todas as ações executadas no sistema para segurança e conformidade com LGPD"
    >
      <div className="space-y-6">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <h3 className="font-display font-semibold text-base flex items-center gap-2">
              <ShieldCheck className="size-5 text-emerald-600" /> Log de Operações do Sistema
            </h3>
            <span className="text-xs text-muted-foreground">
              Total de registros: <strong>{audit.length}</strong>
            </span>
          </div>

          {audit.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <History className="mx-auto mb-3 size-10 opacity-30" />
              <p className="text-sm">Nenhuma alteração registrada nesta sessão.</p>
              <p className="text-xs text-muted-foreground mt-1">
                Todas as criações, edições e exclusões de registros em qualquer módulo aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b bg-muted/40 font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Data / Hora</th>
                    <th className="px-4 py-3">Usuário</th>
                    <th className="px-4 py-3">Operação</th>
                    <th className="px-4 py-3">Módulo</th>
                    <th className="px-4 py-3">Registro ID</th>
                    <th className="px-4 py-3">Detalhes / Dados</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono">
                  {audit.map((entry) => (
                    <tr key={entry.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(entry.datetime).toLocaleString("pt-BR")}
                      </td>
                      <td className="px-4 py-3 font-sans font-semibold text-foreground">
                        {entry.user}
                      </td>
                      <td className="px-4 py-3 font-sans">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                            entry.operation === "Criação"
                              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                              : entry.operation === "Alteração"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                              : entry.operation === "Exclusão"
                              ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                              : "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                          }`}
                        >
                          {entry.operation}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-sans font-medium text-foreground">
                        {entry.moduleId}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{entry.recordId}</td>
                      <td className="px-4 py-3 max-w-xs truncate text-[11px] text-muted-foreground" title={entry.after}>
                        {entry.after}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
