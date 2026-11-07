import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { listModules } from "@/lib/core/registry";
import { useStore } from "@/lib/core/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, User, Building, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/busca")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sgde-auth-v1");
      if (!stored) throw redirect({ to: "/login" });
      const user = JSON.parse(stored);
      if (user.role !== "admin") throw redirect({ to: "/login" });
    }
  },
  component: BuscaGlobalPage,
});

function BuscaGlobalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const modules = listModules();
  const { records } = useStore();

  const results = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];

    return modules.map((mod) => {
      const modRecords = records[mod.id] ?? [];
      const matches = modRecords.filter((row) =>
        mod.searchFields.some((field) => String(row[field] ?? "").toLowerCase().includes(q))
      );
      return {
        module: mod,
        matches,
      };
    }).filter((group) => group.matches.length > 0);
  }, [searchTerm, modules, records]);

  const totalMatches = results.reduce((acc, curr) => acc + curr.matches.length, 0);

  const getModuleIcon = (id: string) => {
    switch (id) {
      case "profissionais":
        return User;
      case "alunos":
        return GraduationCap;
      case "instituicoes":
        return Building;
      default:
        return User;
    }
  };

  return (
    <AppShell
      title="Busca Global"
      subtitle="Pesquise por nome, CPF, matrícula ou INEP em toda a rede educacional"
    >
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Barra de Pesquisa */}
        <div className="relative rounded-2xl border bg-card p-2 shadow-sm">
          <div className="flex items-center gap-3 px-3">
            <Search className="size-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Digite o nome de uma pessoa, CPF, matrícula ou escola..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 text-base shadow-none focus-visible:ring-0"
              autoFocus
            />
            {searchTerm && (
              <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")}>
                Limpar
              </Button>
            )}
          </div>
        </div>

        {/* Resultados */}
        {searchTerm.trim() ? (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Encontrados <strong>{totalMatches}</strong> resultado(s) para "<em>{searchTerm}</em>":
            </p>

            {results.length === 0 ? (
              <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
                <Search className="mx-auto mb-3 size-10 opacity-30" />
                <p className="text-base font-medium text-foreground">Nenhum resultado encontrado</p>
                <p className="text-sm">Tente buscar por outro termo, CPF ou parte do nome.</p>
              </div>
            ) : (
              results.map(({ module: mod, matches }) => {
                const Icon = getModuleIcon(mod.id);
                return (
                  <div key={mod.id} className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between border-b bg-muted/40 px-5 py-3">
                      <div className="flex items-center gap-2 font-semibold">
                        <Icon className="size-4 text-primary" />
                        <span>{mod.name}</span>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium">
                          {matches.length}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/modulos/$moduleId" params={{ moduleId: mod.id }}>
                          Abrir módulo <ArrowRight className="ml-1 size-3.5" />
                        </Link>
                      </Button>
                    </div>

                    <div className="divide-y">
                      {matches.map((row) => (
                        <div key={row.id} className="flex items-center justify-between p-4 hover:bg-muted/30">
                          <div>
                            <p className="font-semibold text-foreground">
                              {row[mod.titleField] || row.nome || "Registro"}
                            </p>
                            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                              {row.matricula && <span>Matrícula: {row.matricula}</span>}
                              {row.matricula_aluno && <span>Matrícula: {row.matricula_aluno}</span>}
                              {row.cpf && <span>CPF: {row.cpf}</span>}
                              {row.inep && <span>INEP: {row.inep}</span>}
                              {row.lotacao_escola && <span>Lotação: {row.lotacao_escola}</span>}
                              {row.turma && <span>Turma: {row.turma}</span>}
                              {row.cargo && <span>Cargo: {row.cargo}</span>}
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link to="/modulos/$moduleId" params={{ moduleId: mod.id }}>
                              Visualizar
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="rounded-xl border bg-muted/20 p-8 text-center text-muted-foreground">
            <p className="text-sm">
              💡 Dica: Você pode pesquisar números de CPF, códigos INEP, matrículas funcionais ou partes do nome de alunos e professores.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
