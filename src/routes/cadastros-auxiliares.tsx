import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Boxes, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/cadastros-auxiliares")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sgde-auth-v1");
      if (!stored) throw redirect({ to: "/login" });
      const user = JSON.parse(stored);
      if (user.role !== "admin") throw redirect({ to: "/login" });
    }
  },
  component: CadastrosAuxiliaresPage,
});

function CadastrosAuxiliaresPage() {
  const [cargos, setCargos] = useState([
    "Professor(a)",
    "Coordenador(a) Pedagógico(a)",
    "Diretor(a) Escolar",
    "Auxiliar de Serviços Gerais",
    "Secretário(a) Escolar",
    "Nutricionista",
  ]);
  const [novoCargo, setNovoCargo] = useState("");

  const [vinculos, setVinculos] = useState([
    "Efetivo",
    "Contrato Temporário",
    "Comissionado",
    "Estágio",
    "Terceirizado",
  ]);
  const [novoVinculo, setNovoVinculo] = useState("");

  const handleAddCargo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoCargo.trim()) return;
    if (cargos.includes(novoCargo.trim())) {
      toast.error("Este cargo já existe.");
      return;
    }
    setCargos([...cargos, novoCargo.trim()]);
    setNovoCargo("");
    toast.success("Cargo adicionado com sucesso!");
  };

  const handleRemoveCargo = (item: string) => {
    setCargos(cargos.filter((c) => c !== item));
    toast.success("Cargo removido.");
  };

  const handleAddVinculo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoVinculo.trim()) return;
    if (vinculos.includes(novoVinculo.trim())) {
      toast.error("Este vínculo já existe.");
      return;
    }
    setVinculos([...vinculos, novoVinculo.trim()]);
    setNovoVinculo("");
    toast.success("Vínculo adicionado com sucesso!");
  };

  const handleRemoveVinculo = (item: string) => {
    setVinculos(vinculos.filter((v) => v !== item));
    toast.success("Vínculo removido.");
  };

  return (
    <AppShell
      title="Cadastros Auxiliares"
      subtitle="Tabelas de apoio e opções padronizadas para formulários e relatórios"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Cargos e Funções */}
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <h3 className="font-display font-semibold text-base flex items-center gap-2">
            <Boxes className="size-4 text-primary" /> Cargos e Funções Padronizadas
          </h3>

          <form onSubmit={handleAddCargo} className="flex gap-2">
            <Input
              placeholder="Novo cargo..."
              value={novoCargo}
              onChange={(e) => setNovoCargo(e.target.value)}
              className="h-9"
            />
            <Button type="submit" size="sm">
              <Plus className="mr-1 size-3.5" /> Adicionar
            </Button>
          </form>

          <div className="divide-y rounded-lg border max-h-64 overflow-y-auto">
            {cargos.map((cargo) => (
              <div key={cargo} className="flex items-center justify-between p-3 text-xs">
                <span className="font-medium text-foreground">{cargo}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={() => handleRemoveCargo(cargo)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Tipos de Vínculo */}
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <h3 className="font-display font-semibold text-base flex items-center gap-2">
            <Boxes className="size-4 text-emerald-600" /> Tipos de Vínculo Funcional
          </h3>

          <form onSubmit={handleAddVinculo} className="flex gap-2">
            <Input
              placeholder="Novo tipo de vínculo..."
              value={novoVinculo}
              onChange={(e) => setNovoVinculo(e.target.value)}
              className="h-9"
            />
            <Button type="submit" size="sm">
              <Plus className="mr-1 size-3.5" /> Adicionar
            </Button>
          </form>

          <div className="divide-y rounded-lg border max-h-64 overflow-y-auto">
            {vinculos.map((vinc) => (
              <div key={vinc} className="flex items-center justify-between p-3 text-xs">
                <span className="font-medium text-foreground">{vinc}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={() => handleRemoveVinculo(vinc)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
