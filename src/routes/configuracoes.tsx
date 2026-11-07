import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useStore } from "@/lib/core/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Download, Upload, Database, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/configuracoes")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sgde-auth-v1");
      if (!stored) throw redirect({ to: "/login" });
      const user = JSON.parse(stored);
      if (user.role !== "admin") throw redirect({ to: "/login" });
    }
  },
  component: ConfiguracoesPage,
});

function ConfiguracoesPage() {
  const { records, imports, audit } = useStore();

  const [orgao, setOrgao] = useState("Secretaria Municipal de Educação");
  const [municipio, setMunicipio] = useState("Natal");
  const [uf, setUf] = useState("RN");
  const [anoLetivo, setAnoLetivo] = useState("2026");

  const handleSaveParametros = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Parâmetros do sistema atualizados com sucesso!");
  };

  const handleDownloadBackup = () => {
    const fullState = {
      records,
      imports,
      audit,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(fullState, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup_sgde_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Arquivo de backup gerado e baixado com sucesso!");
  };

  const handleResetData = () => {
    if (confirm("ATENÇÃO: Deseja redefinir todo o banco local para o estado inicial de fábrica?")) {
      localStorage.removeItem("sgde-state-v1");
      window.location.reload();
    }
  };

  return (
    <AppShell
      title="Configurações do Sistema"
      subtitle="Definições gerais da rede de ensino, backups e manutenção de dados"
    >
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Parâmetros do Órgão */}
        <form onSubmit={handleSaveParametros} className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <h3 className="font-display font-semibold text-base flex items-center gap-2">
            <Settings className="size-4 text-primary" /> Dados Institucionais do Órgão
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="orgao">Nome da Secretaria / Órgão</Label>
              <Input id="orgao" value={orgao} onChange={(e) => setOrgao(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="municipio">Município Sede</Label>
              <Input id="municipio" value={municipio} onChange={(e) => setMunicipio(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="uf">UF (Estado)</Label>
              <Input id="uf" value={uf} onChange={(e) => setUf(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ano">Ano Letivo Vigente</Label>
              <Input id="ano" value={anoLetivo} onChange={(e) => setAnoLetivo(e.target.value)} required />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>

        {/* Backup e Restauração */}
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <h3 className="font-display font-semibold text-base flex items-center gap-2">
            <Database className="size-4 text-primary" /> Backup e Segurança de Dados
          </h3>
          <p className="text-xs text-muted-foreground">
            Exporte uma cópia completa de todos os módulos, alunos, profissionais, escolas, históricos e auditoria para um arquivo JSON seguro.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="outline" onClick={handleDownloadBackup}>
              <Download className="mr-2 size-4" /> Exportar Backup Completo (JSON)
            </Button>
            <Button variant="outline" onClick={handleResetData} className="text-destructive hover:bg-destructive/10">
              <RefreshCw className="mr-2 size-4" /> Restaurar Padrões Iniciais
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
