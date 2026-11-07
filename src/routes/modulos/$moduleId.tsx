import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { getModule, sortedFields, fieldGroups } from "@/lib/core/registry";
import { useStore } from "@/lib/core/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Search, Trash2, Edit3, Printer, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { RecordRow } from "@/lib/core/types";

export const Route = createFileRoute("/modulos/$moduleId")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sgde-auth-v1");
      if (!stored) {
        throw redirect({ to: "/login" });
      }
      const user = JSON.parse(stored);
      if (user.role !== "admin") {
        throw redirect({ to: "/login" });
      }
    }
  },
  component: ModulePage,
});

function ModulePage() {
  const { moduleId } = Route.useParams();
  const mod = getModule(moduleId);
  const { getRecords, createRecord, updateRecord, deleteRecord } = useStore();

  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RecordRow | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  if (!mod) {
    throw notFound();
  }

  const allRecords = getRecords(moduleId);
  const fields = sortedFields(mod);
  const groups = fieldGroups(mod);

  const filteredRecords = useMemo(() => {
    if (!query.trim()) return allRecords;
    const q = query.toLowerCase();
    return allRecords.filter((rec) =>
      mod.searchFields.some((f) => String(rec[f] ?? "").toLowerCase().includes(q))
    );
  }, [allRecords, query, mod]);

  const handleOpenCreate = () => {
    setEditingRecord(null);
    setFormData({});
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: RecordRow) => {
    setEditingRecord(rec);
    setFormData(rec);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este registro?")) {
      deleteRecord(moduleId, id);
      toast.success("Registro excluído com sucesso.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecord) {
      updateRecord(moduleId, editingRecord.id, formData);
      toast.success("Registro atualizado com sucesso!");
    } else {
      createRecord(moduleId, formData);
      toast.success("Registro criado com sucesso!");
    }
    setModalOpen(false);
  };

  const handleFieldChange = (tech: string, val: string) => {
    setFormData((prev) => ({ ...prev, [tech]: val }));
  };

  const listCols = mod.listFields.length > 0 ? mod.listFields : fields.slice(0, 5).map((f) => f.tech);

  return (
    <AppShell
      title={mod.name}
      subtitle={`Gestão, consulta e controle de dados do ${mod.model.code}`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/impressoes">
              <Printer className="mr-1.5 size-4" /> Imprimir
            </Link>
          </Button>
          <Button size="sm" onClick={handleOpenCreate}>
            <Plus className="mr-1.5 size-4" /> Novo {mod.singular}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Barra de Filtros */}
        <div className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder={`Pesquisar ${mod.name.toLowerCase()}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Total: <strong>{filteredRecords.length}</strong> registro(s)
          </p>
        </div>

        {/* Tabela de Dados */}
        <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                {listCols.map((colKey) => {
                  const fieldDef = fields.find((f) => f.tech === colKey);
                  return (
                    <th key={colKey} className="px-4 py-3">
                      {fieldDef?.label ?? colKey}
                    </th>
                  );
                })}
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={listCols.length + 1} className="py-8 text-center text-muted-foreground">
                    Nenhum registro encontrado neste módulo.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/50">
                    {listCols.map((colKey) => (
                      <td key={colKey} className="px-4 py-3 font-medium text-foreground">
                        {row[colKey] || "—"}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(row)}
                          title="Editar registro"
                        >
                          <Edit3 className="size-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(row.id)}
                          title="Excluir registro"
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Criação / Edição */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRecord ? `Editar ${mod.singular}` : `Novo ${mod.singular}`}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            {groups.map((group) => (
              <div key={group.name} className="space-y-3 rounded-lg border p-4">
                <h3 className="font-semibold text-sm text-primary uppercase tracking-wide">
                  {group.name}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.fields.map((field) => (
                    <div key={field.tech} className="space-y-1">
                      <Label htmlFor={field.tech} className="text-xs">
                        {field.label} {field.required && <span className="text-destructive">*</span>}
                      </Label>

                      {field.type === "select" && field.options ? (
                        <Select
                          value={formData[field.tech] || ""}
                          onValueChange={(v) => handleFieldChange(field.tech, v)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.type === "longtext" ? (
                        <Textarea
                          id={field.tech}
                          value={formData[field.tech] || ""}
                          onChange={(e) => handleFieldChange(field.tech, e.target.value)}
                          required={field.required}
                          className="min-h-[60px]"
                        />
                      ) : (
                        <Input
                          id={field.tech}
                          type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                          value={formData[field.tech] || ""}
                          onChange={(e) => handleFieldChange(field.tech, e.target.value)}
                          required={field.required}
                          className="h-9"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Registro</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
