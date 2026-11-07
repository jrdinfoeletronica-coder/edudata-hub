import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { listModules, getModule, fieldGroups } from "@/lib/core/registry";
import { useStore } from "@/lib/core/store";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Printer, FileText } from "lucide-react";

export const Route = createFileRoute("/impressoes")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sgde-auth-v1");
      if (!stored) throw redirect({ to: "/login" });
      const user = JSON.parse(stored);
      if (user.role !== "admin") throw redirect({ to: "/login" });
    }
  },
  component: ImpressoesPage,
});

function ImpressoesPage() {
  const modules = listModules();
  const { getRecords } = useStore();

  const [selectedModuleId, setSelectedModuleId] = useState(modules[0]?.id || "profissionais");
  const targetModule = getModule(selectedModuleId);
  const records = targetModule ? getRecords(targetModule.id) : [];

  const [selectedRecordId, setSelectedRecordId] = useState<string>(records[0]?.id || "");

  const activeRecord = records.find((r) => r.id === selectedRecordId) || records[0];
  const groups = targetModule ? fieldGroups(targetModule) : [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppShell
      title="Central de Impressão"
      subtitle="Modelos oficiais de fichas cadastrais formatadas para impressão A4"
      actions={
        <Button onClick={handlePrint}>
          <Printer className="mr-2 size-4" /> Imprimir Documento
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Seletor no topo (escondido na impressão) */}
        <div className="no-print flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
          <div className="w-64">
            <Label className="text-xs font-semibold">Módulo</Label>
            <Select
              value={selectedModuleId}
              onValueChange={(v) => {
                setSelectedModuleId(v);
                const newRecs = getRecords(v);
                setSelectedRecordId(newRecs[0]?.id || "");
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modules.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[240px]">
            <Label className="text-xs font-semibold">Selecione o Registro</Label>
            <Select
              value={selectedRecordId || activeRecord?.id || ""}
              onValueChange={setSelectedRecordId}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {records.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r[targetModule?.titleField || "nome"] || r.nome || r.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Ficha Formatada para Impressão */}
        {activeRecord && targetModule ? (
          <div className="mx-auto max-w-4xl rounded-xl border bg-card p-8 shadow-sm print:m-0 print:border-none print:p-0 print:shadow-none">
            {/* Cabeçalho Oficial */}
            <div className="border-b-2 border-foreground/80 pb-4 text-center">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Secretaria de Estado da Educação · SEDUC
              </h2>
              <h1 className="mt-1 font-display text-xl font-bold uppercase tracking-tight text-foreground">
                {targetModule.printTitle}
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Código: {targetModule.model.code} · Versão: {targetModule.model.version}
              </p>
            </div>

            {/* Grupos e Campos */}
            <div className="mt-6 space-y-6">
              {groups.map((group) => (
                <div key={group.name} className="space-y-2">
                  <h3 className="border-b border-muted pb-1 text-xs font-bold uppercase tracking-wide text-primary">
                    {group.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 print:grid-cols-3">
                    {group.fields.map((f) => (
                      <div key={f.tech} className="space-y-0.5">
                        <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                          {f.label}
                        </p>
                        <p className="text-xs font-medium text-foreground">
                          {activeRecord[f.tech] || "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Rodapé de Autenticação */}
            <div className="mt-12 border-t pt-6 text-center text-[10px] text-muted-foreground">
              <p>Documento emitido via Sistema de Gestão de Dados da Educação (SGDE) em {new Date().toLocaleDateString("pt-BR")}.</p>
              <div className="mt-8 flex justify-around">
                <div className="border-t border-muted-foreground/40 px-10 pt-1">Assinatura do Responsável</div>
                <div className="border-t border-muted-foreground/40 px-10 pt-1">Carimbo da Unidade Escolar</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            <FileText className="mx-auto mb-3 size-10 opacity-30" />
            <p className="text-sm font-medium">Nenhum registro selecionado para impressão.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
