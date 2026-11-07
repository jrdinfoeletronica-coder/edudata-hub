import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/core/auth";
import { useStore } from "@/lib/core/store";
import { Building, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/cadastro-gestor")({
  component: CadastroGestor,
});

function CadastroGestor() {
  const { loginGestor } = useAuth();
  const { getRecords, createRecord } = useStore();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [cpf, setCpf] = useState("");
  const [inep, setInep] = useState("");
  const [escola, setEscola] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const profissionais = getRecords("profissionais");
    
    const exists = profissionais.find((p) => p.matricula === matricula || p.cpf === cpf);
    if (exists) {
      toast.error("Já existe um profissional cadastrado com este CPF ou Matrícula.");
      return;
    }

    createRecord("profissionais", {
      nome,
      matricula,
      cpf,
      lotacao_inep: inep,
      lotacao_escola: escola,
      cargo: "Gestor Escolar",
      vinculo: "A definir",
      situacao: "A definir",
      data_nascimento: "",
    });

    toast.success("Cadastro do gestor criado com sucesso!");
    loginGestor(nome, inep, matricula, cpf);
    navigate({ to: "/painel-gestor" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm">
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 text-muted-foreground">
          <Link to="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Login
          </Link>
        </Button>

        <div className="mb-8 flex flex-col items-center justify-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Acesso do Gestor
          </h1>
          <p className="text-sm text-muted-foreground">
            Crie sua conta para gerenciar os alunos da escola
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inep">Código INEP da Escola</Label>
            <Input
              id="inep"
              placeholder="Ex: 24012345"
              value={inep}
              onChange={(e) => setInep(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="escola">Nome da Escola</Label>
            <Input
              id="escola"
              placeholder="Ex: E.M. Monteiro Lobato"
              value={escola}
              onChange={(e) => setEscola(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo do Gestor</Label>
            <Input
              id="nome"
              placeholder="Digite seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="matricula">Matrícula Funcional</Label>
            <Input
              id="matricula"
              placeholder="Ex: 10245"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              placeholder="Digite seu CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Registrar Gestor
          </Button>
        </form>
      </div>
    </div>
  );
}
