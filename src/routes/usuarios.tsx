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

import { useAuth } from "@/lib/core/auth";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { UserPlus, Trash2 } from "lucide-react";

function UsuariosPage() {
  const { getRecords } = useStore();
  const { adminAccounts, createAdminAccount, deleteAdminAccount } = useAuth();
  const profs = getRecords("profissionais");

  const [modalAdminOpen, setModalAdminOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminUser, setNewAdminUser] = useState("");
  const [newAdminPass, setNewAdminPass] = useState("");

  const gestores = profs.filter((p) => p.cargo === "Gestor Escolar" || p.lotacao_inep);

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminUser.trim() || !newAdminPass.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }

    const success = createAdminAccount(newAdminName, newAdminUser, newAdminPass);
    if (success) {
      toast.success(`Administrador "${newAdminName}" cadastrado com sucesso!`);
      setNewAdminName("");
      setNewAdminUser("");
      setNewAdminPass("");
      setModalAdminOpen(false);
    } else {
      toast.error("Já existe um administrador com esse nome de usuário.");
    }
  };

  const handleDeleteAdmin = (id: string, name: string) => {
    if (adminAccounts.length <= 1) {
      toast.error("O sistema deve possuir pelo menos um administrador.");
      return;
    }
    if (confirm(`Tem certeza que deseja remover o administrador "${name}"?`)) {
      deleteAdminAccount(id);
      toast.success("Administrador removido com sucesso.");
    }
  };

  return (
    <AppShell
      title="Usuários e Permissões de Acesso"
      subtitle="Gerenciamento de credenciais, administradores gerais e gestores das escolas"
    >
      <div className="space-y-6">
        {/* Administradores do Sistema */}
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-display font-semibold text-base flex items-center gap-2">
                <Shield className="size-4 text-primary" /> Administradores Gerais do Sistema
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Usuários com permissão total para gerenciar modelos, configurações, backups e todos os módulos.
              </p>
            </div>
            <Button size="sm" onClick={() => setModalAdminOpen(true)}>
              <UserPlus className="mr-1.5 size-4" /> Novo Administrador
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {adminAccounts.map((adm) => (
              <div key={adm.id} className="rounded-lg border p-4 flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm uppercase">
                    {adm.name.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{adm.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Usuário: <strong className="text-foreground">{adm.username}</strong> · Criado em: {adm.createdAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                    Admin
                  </span>
                  {adminAccounts.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive"
                      onClick={() => handleDeleteAdmin(adm.id, adm.name)}
                      title="Excluir este administrador"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
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

      {/* Modal para Cadastrar Novo Administrador */}
      <Dialog open={modalAdminOpen} onOpenChange={setModalAdminOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="size-5 text-primary" /> Cadastrar Novo Administrador
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateAdmin} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="adminName">Nome Completo</Label>
              <Input
                id="adminName"
                placeholder="Ex: Carlos Eduardo Silva"
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="adminUsername">Nome de Usuário (Login)</Label>
              <Input
                id="adminUsername"
                placeholder="Ex: carloseduardo"
                value={newAdminUser}
                onChange={(e) => setNewAdminUser(e.target.value)}
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Será utilizado na tela de login na aba "Admin".
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="adminPassword">Senha de Acesso</Label>
              <Input
                id="adminPassword"
                type="password"
                placeholder="Digite a senha..."
                value={newAdminPass}
                onChange={(e) => setNewAdminPass(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setModalAdminOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Criar Administrador
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
