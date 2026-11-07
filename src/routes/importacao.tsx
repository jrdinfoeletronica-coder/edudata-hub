import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { listModules, getModule } from "@/lib/core/registry";
import { useStore } from "@/lib/core/store";
import { parseDelimited } from "@/lib/core/csv";
import { validateRecord } from "@/lib/core/validation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, History } from "lucide-react";
import { toast } from "sonner";
import type { RecordRow } from "@/lib/core/types";

export const Route = createFileRoute("/importacao")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sgde-auth-v1");
      if (!stored) throw redirect({ to: "/login" });
      const user = JSON.parse(stored);
      if (user.role !== "admin") throw redirect({ to: "/login" });
    }
  },
  component: ImportacaoPage,
});

function ImportacaoPage() {
  const modules = listModules();
  const { bulkImport, imports } = useStore();

  const [selectedModuleId, setSelectedModuleId] = useState<string>(modules[0]?.id || "profissionais");
  const [csvContent, setCsvContent] = useState("");
  const [previewData, setPreviewData] = useState<{
    valid: Omit<RecordRow, "id">[];
    invalid: { row: Record<string, string>; errors: Record<string, string> }[];
  } | null>(null);

  const targetModule = getModule(selectedModuleId);

  const handleProcess = () => {
    if (!targetModule) return;
    if (!csvContent.trim()) {
      toast.error("Por favor, cole o conteúdo da planilha ou CSV.");
      return;
    }

    const rows = parseDelimited(csvContent);
    if (rows.length < 2) {
      toast.error("O arquivo precisa conter pelo menos o cabeçalho e uma linha de dados.");
      return;
    }

    const [headerRow, ...dataRows] = rows;
    const headerMap = headerRow.map((col) => col.trim().toLowerCase());

    const fields = targetModule.model.fields;
    const valid: Omit<RecordRow, "id">[] = [];
    const invalid: { row: Record<string, string>; errors: Record<string, string> }[] = [];

    dataRows.forEach((r) => {
      const rowObj: Record<string, string> = {};
      headerMap.forEach((colName, idx) => {
        // Encontrar campo pelo nome técnico ou nome amigável
        const match = fields.find(
          (f) =>
            f.tech.toLowerCase() === colName ||
            f.label.toLowerCase() === colName ||
            f.code.toLowerCase() === colName
        );
        if (match) {
          rowObj[match.tech] = r[idx] ?? "";
        }
      });

      const errs = validateRecord(fields, rowObj);
      if (Object.keys(errs).length === 0) {
        valid.push(rowObj);
      } else {
        invalid.push({ row: rowObj, errors: errs });
      }
    });

    setPreviewData({ valid, invalid });
    toast.info(`Análise concluída: ${valid.length} válidos, ${invalid.length} rejeitados.`);
  };

  const handleConfirmImport = () => {
    if (!previewData || !targetModule) return;
    if (previewData.valid.length === 0) {
      toast.error("Nenhum registro válido para importar.");
      return;
    }

    const allErrors = previewData.invalid.map(
      (inv, idx) => `Linha ${idx + 1}: ${Object.values(inv.errors).join(", ")}`
    );

    bulkImport(selectedModuleId, previewData.valid, {
      file: `importacao_${targetModule.id}_manual.csv`,
      total: previewData.valid.length + previewData.invalid.length,
      rejected: previewData.invalid.length,
      errors: allErrors,
    });

    toast.success(`${previewData.valid.length} registro(s) importado(s) com sucesso!`);
    setCsvContent("");
    setPreviewData(null);
  };

  return (
    <AppShell
      title="Importação Modular de Planilhas"
      subtitle="Validação, comparação com modelo de dados e importação de registros em lote"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Formulário de Importação */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-5">
            <div>
              <Label className="text-sm font-semibold">1. Selecione o Módulo de Destino</Label>
              <Select value={selectedModuleId} onValueChange={(v) => { setSelectedModuleId(v); setPreviewData(null); }}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Selecione o módulo..." />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} ({m.model.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-muted-foreground">
                O modelo atual possui {targetModule?.model.fields.length} campos catalogados.
              </p>
            </div>

            <div>
              <Label className="text-sm font-semibold">2. Enviar Arquivo (.xlsx, .xls ou .csv)</Label>
              <div className="mt-1.5 flex items-center gap-3">
                <input
                  type="file"
                  id="fileUpload"
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
                      try {
                        const XLSX = await import("xlsx");
                        const buffer = await file.arrayBuffer();
                        const wb = XLSX.read(buffer, { type: "array" });
                        const firstSheetName = wb.SheetNames[0];
                        const ws = wb.Sheets[firstSheetName];
                        const csv = XLSX.utils.sheet_to_csv(ws, { FS: ";" });
                        setCsvContent(csv);
                        toast.success(`Planilha "${file.name}" carregada com sucesso!`);
                      } catch (err) {
                        toast.error("Erro ao ler o arquivo Excel.");
                      }
                    } else {
                      const text = await file.text();
                      setCsvContent(text);
                      toast.success(`Arquivo CSV "${file.name}" carregado!`);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("fileUpload")?.click()}
                  className="w-full sm:w-auto"
                >
                  <FileSpreadsheet className="mr-2 size-4 text-emerald-600" /> Selecionar Arquivo Excel / CSV
                </Button>
                <span className="text-xs text-muted-foreground">ou cole o texto abaixo:</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold">3. Conteúdo da Planilha / CSV</Label>
              <Textarea
                placeholder={`Cole aqui as linhas copiadas do Excel ou CSV...\nPROFISSIONAL_CPF;PROFISSIONAL_NOME;PROFISSIONAL_SEXO;CO_ENTIDADE`}
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                className="mt-1.5 min-h-[140px] font-mono text-xs"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Suporta planilhas Excel nativas (.xlsx, .xls), arquivos CSV com ponto-e-vírgula (;) ou texto copiado do Excel.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button onClick={handleProcess}>
                <FileSpreadsheet className="mr-2 size-4" /> Analisar e Pré-visualizar
              </Button>
            </div>
          </div>

          {/* Pré-visualização de Validação */}
          {previewData && (
            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
              <h3 className="font-display font-semibold text-base">Resultado da Pré-Validação</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50/50 p-4 dark:border-green-950 dark:bg-green-950/20">
                  <CheckCircle2 className="size-6 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-green-900 dark:text-green-300">
                      {previewData.valid.length} registro(s) prontos
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-400">
                      Passaram por todas as regras do modelo
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-950 dark:bg-amber-950/20">
                  <AlertTriangle className="size-6 text-amber-600" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                      {previewData.invalid.length} registro(s) com pendências
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      Serão rejeitados ou corrigidos
                    </p>
                  </div>
                </div>
              </div>

              {previewData.invalid.length > 0 && (
                <div className="rounded-lg border bg-muted/40 p-3 text-xs space-y-1 max-h-36 overflow-y-auto">
                  <p className="font-semibold text-destructive">Inconsistências detectadas:</p>
                  {previewData.invalid.slice(0, 5).map((inv, i) => (
                    <p key={i} className="text-muted-foreground">
                      Linha {i + 1}: {Object.entries(inv.errors).map(([k, err]) => `${k} (${err})`).join(", ")}
                    </p>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setPreviewData(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleConfirmImport} disabled={previewData.valid.length === 0}>
                  <Upload className="mr-2 size-4" /> Confirmar e Gravar {previewData.valid.length} Registros
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Histórico Recente de Importações */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <History className="size-4 text-muted-foreground" />
              <h3 className="font-display font-semibold text-sm">Histórico de Importações</h3>
            </div>

            {imports.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhuma importação realizada ainda.</p>
            ) : (
              <div className="space-y-3">
                {imports.slice(0, 6).map((imp) => (
                  <div key={imp.id} className="rounded-lg border p-3 text-xs space-y-1">
                    <p className="font-medium text-foreground">{imp.file}</p>
                    <p className="text-muted-foreground">
                      Módulo: <strong>{imp.moduleId}</strong> · {imp.imported} importados
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(imp.datetime).toLocaleString("pt-BR")}
                      </span>
                      <span className="font-semibold text-green-600">{imp.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
