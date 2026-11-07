import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/core/auth";
import { useStore } from "@/lib/core/store";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/cadastro-profissional")({
  component: CadastroProfissional,
});

function CadastroProfissional() {
  const { loginProfissional } = useAuth();
  const { getRecords, createRecord } = useStore();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [cpf, setCpf] = useState("");
  const [escola, setEscola] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const profissionais = getRecords("profissionais");
    
    // Verificar se já existe
    const exists = profissionais.find((p) => p.matricula === matricula || p.cpf === cpf);
    if (exists) {
      toast.error("Já existe um profissional cadastrado com este CPF ou Matrícula.");
      return;
    }

    // Criar registro mínimo
    createRecord("profissionais", {
      nome,
      matricula,
      cpf,
      lotacao_escola: escola,
      cargo: "A definir",
      vinculo: "A definir",
      situacao: "A definir",
      data_nascimento: "",
    });

    toast.success("Cadastro criado com sucesso!");
    loginProfissional(nome, matricula, cpf);
    navigate({ to: "/meu-cadastro" });
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
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Crie sua conta
          </h1>
          <p className="text-sm text-muted-foreground">
            Autocadastro do Profissional da Educação
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
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
          <div className="space-y-2">
            <Label htmlFor="escola">Escola de Lotação</Label>
            <Input
              id="escola"
              placeholder="Ex: E.M. Monteiro Lobato"
              value={escola}
              onChange={(e) => setEscola(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Criar Cadastro
          </Button>
        </form>
      </div>
    </div>
  );
}
