import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/core/auth";
import { useStore } from "@/lib/core/store";
import { GraduationCap, Shield, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const { loginAdmin, loginProfissional, loginGestor } = useAuth();
  const { getRecords } = useStore();
  const navigate = useNavigate();

  // Admin state
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");

  // Profissional state
  const [profMatricula, setProfMatricula] = useState("");
  const [profCpf, setProfCpf] = useState("");

  // Gestor state
  const [gestorInep, setGestorInep] = useState("");
  const [gestorMatricula, setGestorMatricula] = useState("");
  const [gestorCpf, setGestorCpf] = useState("");

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleAdminLogin - adminUser:', adminUser, 'adminPass:', adminPass);
    const success = await loginAdmin(adminUser, adminPass);
    if (success) {
      navigate({ to: "/" });
    } else {
      toast.error("Usuário ou senha de administrador inválidos.");
    }
  };

  const handleProfLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const profissionais = getRecords("profissionais");
    const found = profissionais.find(
      (p) => p.matricula === profMatricula && p.cpf === profCpf
    );

    if (found) {
      loginProfissional(found.nome, profMatricula, profCpf);
      navigate({ to: "/meu-cadastro" });
    } else {
      toast.error("Matrícula ou CPF não encontrados.");
    }
  };

  const handleGestorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const profissionais = getRecords("profissionais");
    const found = profissionais.find(
      (p) => p.matricula === gestorMatricula && p.cpf === gestorCpf && p.lotacao_inep === gestorInep
    );

    if (found) {
      loginGestor(found.nome, gestorInep, gestorMatricula, gestorCpf);
      navigate({ to: "/painel-gestor" });
    } else {
      toast.error("Gestor não encontrado para este INEP, Matrícula e CPF.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-8 flex flex-col items-center justify-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            EduData Hub
          </h1>
          <p className="text-sm text-muted-foreground">
            Sistema de Gestão de Dados da Educação
          </p>
        </div>

        <Tabs defaultValue="profissional" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profissional">
              <User className="mr-2 h-4 w-4" />
              Profissional
            </TabsTrigger>
            <TabsTrigger value="gestor">
              <Building className="mr-2 h-4 w-4" />
              Gestor
            </TabsTrigger>
            <TabsTrigger value="admin">
              <Shield className="mr-2 h-4 w-4" />
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profissional">
            <form onSubmit={handleProfLogin} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="matricula">Matrícula</Label>
                <Input
                  id="matricula"
                  placeholder="Ex: 10245"
                  value={profMatricula}
                  onChange={(e) => setProfMatricula(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="Apenas números ou com formatação"
                  value={profCpf}
                  onChange={(e) => setProfCpf(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
              <div className="mt-4 text-center text-sm">
                Primeiro acesso?{" "}
                <Link to="/cadastro-profissional" className="text-primary hover:underline">
                  Cadastre-se aqui
                </Link>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="gestor">
            <form onSubmit={handleGestorLogin} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="inep">Código INEP da Escola</Label>
                <Input
                  id="inep"
                  placeholder="Ex: 24012345"
                  value={gestorInep}
                  onChange={(e) => setGestorInep(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gMatricula">Matrícula</Label>
                <Input
                  id="gMatricula"
                  placeholder="Ex: 10245"
                  value={gestorMatricula}
                  onChange={(e) => setGestorMatricula(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gCpf">CPF</Label>
                <Input
                  id="gCpf"
                  placeholder="Apenas números ou com formatação"
                  value={gestorCpf}
                  onChange={(e) => setGestorCpf(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
              <div className="mt-4 text-center text-sm">
                Ainda não tem acesso?{" "}
                <Link to="/cadastro-gestor" className="text-primary hover:underline">
                  Cadastre sua escola aqui
                </Link>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="admin">
            <form onSubmit={handleAdminLogin} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="adminUser">Usuário</Label>
                <Input
                  id="adminUser"
                  placeholder="admin"
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminPass">Senha</Label>
                <Input
                  id="adminPass"
                  type="password"
                  placeholder="admin123"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Entrar como Admin
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
