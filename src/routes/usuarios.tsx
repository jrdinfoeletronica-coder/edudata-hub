import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useStore } from "@/lib/core/store";
import { UserCog, Shield, Building, User, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/usuarios")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sgde-auth-v1");
      if (!stored) throw redirect({ to: "/login" });
      const user = JSON.parse(stored);
      if (user.role !== "admin") throw redirect({ to: "/login" });
    }
  },
  component: UsuariosPage,
});

function UsuariosPage() {
  const { getRecords } = useStore();
  const profs = getRecords("profissionais");

  const gestores = profs.filter((p) => p.cargo === "Gestor Escolar" || p.lotacao_inep);

  return (
    <AppShell
      title="Usuários e Permissões de Acesso"
      subtitle="Gerenciamento de credenciais, papéis de acesso e diretores das escolas"
    >
      <div className="space-y-6">
        {/* Administradores do Sistema */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-display font-semibold text-base mb-4 flex items-center gap-2">
            <Shield className="size-4 text-primary" /> Administradores Gerais
          </h3>
          <div className="rounded-lg border p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                AD
              </div>
              <div>
                <p className="font-semibold text-foreground">Administrador Geral</p>
                <p className="text-xs text-muted-foreground">Usuário: admin · Acesso irrestrito a todos os módulos e configurações</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              Ativo
            </span>
          </div>
        </div>

        {/* Gestores Escolares */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-display font-semibold text-base mb-4 flex items-center gap-2">
            <Building className="size-4 text-emerald-600" /> Gestores e Diretores de Escola
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Nome do Gestor</th>
                  <th className="px-4 py-3">Matrícula</th>
                  <th className="px-4 py-3">CPF</th>
                  <th className="px-4 py-3">INEP Vinculado</th>
                  <th className="px-4 py-3">Escola</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {gestores.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-muted-foreground text-xs">
                      Nenhum gestor com INEP cadastrado.
                    </td>
                  </tr>
                ) : (
                  gestores.map((g) => (
                    <tr key={g.id} className="hover:bg-muted/40">
                      <td className="px-4 py-3 font-medium text-foreground">{g.nome}</td>
                      <td className="px-4 py-3 text-xs">{g.matricula}</td>
                      <td className="px-4 py-3 text-xs">{g.cpf}</td>
                      <td className="px-4 py-3 font-mono font-semibold text-primary text-xs">
                        {g.lotacao_inep || "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {g.lotacao_escola || "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.success(`Acesso verificado para ${g.nome}`)}
                          className="h-8 text-xs"
                        >
                          <KeyRound className="size-3.5 mr-1" /> Permissões
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
