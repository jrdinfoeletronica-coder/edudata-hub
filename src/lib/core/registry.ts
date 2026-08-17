import type { ModuleDef } from "@/lib/core/types";
import { professionalsModule } from "@/lib/modules/professionals";

/**
 * REGISTRO DE MÓDULOS
 * ---------------------------------------------------------------
 * Cada nova planilha analisada gera um novo ModuleDef e é apenas
 * adicionada a esta lista. Todas as telas do sistema (listagem,
 * cadastro, importação, exportação, impressão, busca global,
 * dashboard e gerenciador de modelos) são geradas dinamicamente a
 * partir do modelo — nenhuma tela precisa ser reconstruída.
 */
const modules: ModuleDef[] = [professionalsModule];

export const listModules = (): ModuleDef[] => modules;

export const getModule = (id: string): ModuleDef | undefined =>
  modules.find((m) => m.id === id);

export const getField = (mod: ModuleDef, tech: string) =>
  mod.model.fields.find((f) => f.tech === tech);

export const sortedFields = (mod: ModuleDef) =>
  [...mod.model.fields].sort((a, b) => a.order - b.order);

export const fieldGroups = (mod: ModuleDef) => {
  const groups: { name: string; fields: typeof mod.model.fields }[] = [];
  for (const field of sortedFields(mod)) {
    let g = groups.find((x) => x.name === field.group);
    if (!g) {
      g = { name: field.group, fields: [] };
      groups.push(g);
    }
    g.fields.push(field);
  }
  return groups;
};
