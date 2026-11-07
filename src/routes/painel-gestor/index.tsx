import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/core/auth";
import { useStore } from "@/lib/core/store";
import { GestorShell } from "@/components/GestorShell";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";

export const Route = createFileRoute("/painel-gestor/")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sgde-auth-v1");
      if (!stored) {
        throw redirect({ to: "/login" });
      }
      const user = JSON.parse(stored);
      if (user.role !== "gestor") {
        throw redirect({ to: "/" });
      }
    }
  },
  component: PainelGestor,
});

function PainelGestor() {
  const { user } = useAuth();
  const { getRecords } = useStore();

  const todosAlunos = getRecords("alunos");
  // Filtra apenas os alunos da escola do gestor logado
  const alunosEscola = todosAlunos.filter((a) => a.lotacao_inep === user?.inep);

  return (
    <GestorShell
      title="Gestão de Alunos"
      subtitle={`Alunos matriculados (INEP: ${user?.inep})`}
      actions={
        <Button asChild>
          <Link to="/painel-gestor/novo-aluno">
            <Plus className="mr-2 h-4 w-4" /> Novo Aluno
          </Link>
        </Button>
      }
    >
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        {alunosEscola.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Users className="mb-4 h-12 w-12 opacity-20" />
            <h3 className="text-lg font-medium text-foreground">Nenhum aluno cadastrado</h3>
            <p className="mt-1">Comece adicionando alunos para esta escola.</p>
            <Button asChild className="mt-4" variant="outline">
              <Link to="/painel-gestor/novo-aluno">Cadastrar primeiro aluno</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">Matrícula</th>
                  <th className="py-3 px-4">Nome do Aluno</th>
                  <th className="py-3 px-4">Turma</th>
                  <th className="py-3 px-4">Situação</th>
                  <th className="py-3 px-4">Responsável</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {alunosEscola.map((aluno) => (
                  <tr key={aluno.id} className="hover:bg-muted/50">
                    <td className="py-3 px-4">{aluno.matricula_aluno}</td>
                    <td className="py-3 px-4 font-medium text-foreground">{aluno.nome}</td>
                    <td className="py-3 px-4">{aluno.turma}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {aluno.situacao}
                      </span>
                    </td>
                    <td className="py-3 px-4">{aluno.nome_responsavel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </GestorShell>
  );
}
