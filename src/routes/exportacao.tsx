import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { listModules, getModule, sortedFields } from "@/lib/core/registry";
import { useStore } from "@/lib/core/store";
import { toCsv, downloadFile, downloadXlsx } from "@/lib/core/csv";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileSpreadsheet, CheckSquare } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/exportacao")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sgde-auth-v1");
      if (!stored) throw redirect({ to: "/login" });
      const user = JSON.parse(stored);
      if (user.role !== "admin") throw redirect({ to: "/login" });
    }
  },
  component: ExportacaoPage,
});

function ExportacaoPage() {
  const modules = listModules();
  const { getRecords } = useStore();

  const [selectedModuleId, setSelectedModuleId] = useState(modules[0]?.id || "profissionais");
  const [format, setFormat] = useState<"xlsx" | "csv">("xlsx");
  const [delimiter, setDelimiter] = useState(";");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const targetModule = getModule(selectedModuleId);
  const fields = targetModule ? sortedFields(targetModule) : [];
  const records = targetModule ? getRecords(targetModule.id) : [];

  // Alternar campo selecionado
  const toggleField = (tech: string) => {
    setSelectedFields((prev) =>
      prev.includes(tech) ? prev.filter((k) => k !== tech) : [...prev, tech]
    );
  };

  const selectAll = () => {
    setSelectedFields(fields.map((f) => f.tech));
  };

  const deselectAll = () => {
    setSelectedFields([]);
  };

  const handleExport = async () => {
    if (!targetModule) return;
    if (records.length === 0) {
      toast.error("Não há registros neste módulo para exportar.");
      return;
    }

    // Mantém a ordem oficial do modelo para os campos selecionados
    const exportTechs = fields
      .map((f) => f.tech)
      .filter((tech) => selectedFields.length === 0 || selectedFields.includes(tech));

    // Cabeçalho: usa o nome técnico oficial da planilha do Censo/SEDUC
    const headers = exportTechs;

    // Linhas: caso o valor seja do tipo '1 - Masculino', exporta apenas o código numérico '1'
    const rows = records.map((rec) =>
      exportTechs.map((tech) => {
        const val = String(rec[tech] ?? "");
        const codeMatch = val.match(/^(\d+)\s*-\s*/);
        return codeMatch ? codeMatch[1] : val;
      })
    );

    const dateStr = new Date().toISOString().slice(0, 10);

    if (format === "xlsx") {
      const fileName = `${targetModule.id}_censo_${dateStr}.xlsx`;
      await downloadXlsx(fileName, targetModule.name, headers, rows);
      toast.success(`Exportação Excel (.xlsx) concluída! ${records.length} registro(s) baixados.`);
    } else {
      const csvContent = toCsv(headers, rows, delimiter);
      const fileName = `${targetModule.id}_censo_${dateStr}.csv`;
      downloadFile(fileName, csvContent);
      toast.success(`Exportação CSV (.csv) concluída! ${records.length} registro(s) baixados.`);
    }
  };

  return (
    <AppShell
      title="Exportação de Dados"
      subtitle="Exporte dados dos módulos cadastrados para Excel (.xlsx) ou CSV preservando a estrutura oficial"
    >
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label className="text-sm font-semibold">Módulo de Origem</Label>
              <Select
                value={selectedModuleId}
                onValueChange={(v) => {
                  setSelectedModuleId(v);
                  setSelectedFields([]);
                }}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Selecione o módulo..." />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} ({getRecords(m.id).length} registros)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-semibold">Formato do Arquivo</Label>
              <Select value={format} onValueChange={(v) => setFormat(v as "xlsx" | "csv")}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xlsx">📊 Planilha Excel (.xlsx)</SelectItem>
                  <SelectItem value="csv">📄 Texto Separado por Delimitador (.csv)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {format === "csv" ? (
              <div>
                <Label className="text-sm font-semibold">Separador CSV</Label>
                <Select value={delimiter} onValueChange={setDelimiter}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=";">Ponto e vírgula (;) — Padrão Brasil</SelectItem>
                    <SelectItem value=",">Vírgula (,)</SelectItem>
                    <SelectItem value="&#9;">Tabulação (\t)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="flex flex-col justify-end">
                <p className="text-xs text-muted-foreground pb-2">
                  ✓ Compatível diretamente com Microsoft Excel, LibreOffice e Google Planilhas.
                </p>
              </div>
            )}
          </div>

          {/* Seleção de Colunas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <Label className="text-sm font-semibold">
                Colunas a Exportar ({selectedFields.length || fields.length} de {fields.length})
              </Label>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={selectAll} className="h-7 text-xs">
                  Marcar Todas
                </Button>
                <Button variant="ghost" size="sm" onClick={deselectAll} className="h-7 text-xs">
                  Desmarcar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 max-h-72 overflow-y-auto p-1">
              {fields.map((f, index) => {
                const isChecked = selectedFields.length === 0 || selectedFields.includes(f.tech);
                return (
                  <div key={f.tech} className="flex items-center space-x-2">
                    <Checkbox
                      id={`chk-${f.tech}`}
                      checked={isChecked}
                      onCheckedChange={() => toggleField(f.tech)}
                    />
                    <label
                      htmlFor={`chk-${f.tech}`}
                      className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {index + 1}.
                      </span>
                      <span>{f.label}</span>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-xs text-muted-foreground">
              Total disponível para download: <strong>{records.length}</strong> registro(s).
            </p>
            <Button onClick={handleExport} disabled={records.length === 0}>
              <Download className="mr-2 size-4" />
              {format === "xlsx" ? "Baixar Planilha Excel (.xlsx)" : "Baixar Arquivo CSV (.csv)"}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
