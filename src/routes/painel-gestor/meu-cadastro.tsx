import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/core/auth";
import { useStore } from "@/lib/core/store";
import { getModule, fieldGroups } from "@/lib/core/registry";
import { GestorShell } from "@/components/GestorShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { RecordRow } from "@/lib/core/types";

export const Route = createFileRoute("/painel-gestor/meu-cadastro")({
  component: MeuCadastroGestor,
});

function MeuCadastroGestor() {
  const { user } = useAuth();
  const { getRecords, updateRecord } = useStore();
  const mod = getModule("profissionais");

  const [record, setRecord] = useState<RecordRow | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.matricula && user?.cpf) {
      const records = getRecords("profissionais");
      const found = records.find((r) => r.matricula === user.matricula && r.cpf === user.cpf);
      if (found) {
        setRecord(found);
        setFormData(found);
      }
    }
  }, [user, getRecords]);

  if (!mod || !record) return null;

  const groups = fieldGroups(mod);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateRecord("profissionais", record.id, formData);
    toast.success("Seus dados profissionais foram atualizados!");
  };

  const handleChange = (tech: string, val: string) => {
    setFormData((prev) => ({ ...prev, [tech]: val }));
  };

  return (
    <GestorShell title="Meu Cadastro Profissional" subtitle="Mantenha seus dados funcionais sempre atualizados.">
      <form onSubmit={handleSave} className="space-y-8">
        {groups.map((group) => (
          <div key={group.name} className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">{group.name}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.fields.map((field) => (
                <div key={field.tech} className="space-y-2">
                  <Label htmlFor={field.tech} className="flex items-center justify-between">
                    <span>
                      {field.label} {field.required && <span className="text-destructive">*</span>}
                    </span>
                  </Label>

                  {field.type === "select" && field.options ? (
                    <Select
                      value={formData[field.tech] || ""}
                      onValueChange={(v) => handleChange(field.tech, v)}
                    >
                      <SelectTrigger>
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
                      onChange={(e) => handleChange(field.tech, e.target.value)}
                      required={field.required}
                    />
                  ) : (
                    <Input
                      id={field.tech}
                      type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                      value={formData[field.tech] || ""}
                      onChange={(e) => handleChange(field.tech, e.target.value)}
                      required={field.required}
                      disabled={field.tech === "matricula" || field.tech === "cpf" || field.tech === "lotacao_inep"} // Impede mudar a chave
                    />
                  )}
                  {field.description && (
                    <p className="text-[0.65rem] text-muted-foreground">{field.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Salvar Alterações
          </Button>
        </div>
      </form>
    </GestorShell>
  );
}
