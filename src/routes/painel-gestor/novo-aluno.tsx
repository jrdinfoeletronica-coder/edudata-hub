import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/core/auth";
import { useStore } from "@/lib/core/store";
import { getModule, fieldGroups } from "@/lib/core/registry";
import { GestorShell } from "@/components/GestorShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/painel-gestor/novo-aluno")({
  component: NovoAluno,
});

function NovoAluno() {
  const { user } = useAuth();
  const { createRecord } = useStore();
  const navigate = useNavigate();
  const mod = getModule("alunos");

  // Iniciar formulário com o INEP preenchido
  const [formData, setFormData] = useState<Record<string, string>>({
    lotacao_inep: user?.inep || "",
  });

  if (!mod) return null;
  const groups = fieldGroups(mod);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    createRecord("alunos", formData);
    toast.success("Aluno cadastrado com sucesso!");
    navigate({ to: "/painel-gestor" });
  };

  const handleChange = (tech: string, val: string) => {
    setFormData((prev) => ({ ...prev, [tech]: val }));
  };

  return (
    <GestorShell title="Cadastrar Novo Aluno" subtitle="Preencha os dados do aluno para adicioná-old à escola.">
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground">
          <Link to="/painel-gestor">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a lista
          </Link>
        </Button>
      </div>

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
                      required={field.required}
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
                  ) : (
                    <Input
                      id={field.tech}
                      type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                      value={formData[field.tech] || ""}
                      onChange={(e) => handleChange(field.tech, e.target.value)}
                      required={field.required}
                      disabled={field.tech === "lotacao_inep"} // O INEP já vem preenchido da conta do gestor
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
            Salvar Aluno
          </Button>
        </div>
      </form>
    </GestorShell>
  );
}
