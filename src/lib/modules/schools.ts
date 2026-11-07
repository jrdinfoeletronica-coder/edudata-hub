import type { FieldDef, ModuleDef } from "@/lib/core/types";

const f = (
  order: number,
  code: string,
  tech: string,
  label: string,
  group: string,
  type: FieldDef["type"],
  required: boolean,
  description: string,
  extra?: Partial<FieldDef>,
): FieldDef => ({
  id: tech,
  tech,
  label,
  description,
  type,
  required,
  code,
  group,
  order,
  ...extra,
});

const G1 = "IDENTIFICAÇÃO DA INSTITUIÇÃO";
const G2 = "LOCALIZAÇÃO E CONTATO";
const G3 = "ESTRUTURA E GESTÃO";

export const schoolsFields: FieldDef[] = [
  f(1, "E-001", "inep", "Código INEP", G1, "text", true, "Código oficial do INEP com 8 dígitos", { rule: "8 dígitos, chave única" }),
  f(2, "E-002", "nome", "Nome da Escola", G1, "text", true, "Nome oficial completo da instituição de ensino"),
  f(3, "E-003", "sigla", "Sigla", G1, "text", false, "Sigla ou abreviação comum"),
  f(4, "E-004", "tipo_dependencia", "Dependência Administrativa", G1, "select", true, "Esfera administrativa", {
    options: ["Municipal", "Estadual", "Federal", "Privada"],
  }),
  f(5, "E-005", "situacao_funcionamento", "Situação de Funcionamento", G1, "select", true, "Status atual da escola", {
    options: ["Em Atividade", "Paralisada", "Extinta"],
  }),

  f(6, "E-006", "cep", "CEP", G2, "text", false, "Código de endereçamento postal"),
  f(7, "E-007", "endereco", "Endereço completo", G2, "text", false, "Rua, número e complemento"),
  f(8, "E-008", "bairro", "Bairro", G2, "text", false, "Bairro da instituição"),
  f(9, "E-009", "municipio", "Município", G2, "text", true, "Município onde a escola está localizada"),
  f(10, "E-010", "uf", "UF", G2, "text", true, "Estado da federação (2 letras)", { rule: "2 caracteres" }),
  f(11, "E-011", "telefone", "Telefone", G2, "phone", false, "Telefone institucional de contato"),
  f(12, "E-012", "email", "E-mail", G2, "email", false, "E-mail oficial da escola"),

  f(13, "E-013", "diretor_responsavel", "Diretor(a) Responsável", G3, "text", false, "Nome do diretor escolar atual"),
  f(14, "E-014", "etapas_atendidas", "Etapas de Ensino", G3, "text", false, "Ex: Educação Infantil, Ensino Fundamental"),
  f(15, "E-015", "observacoes", "Observações", G3, "longtext", false, "Informações complementares sobre a unidade"),
];

export const schoolsModule: ModuleDef = {
  id: "instituicoes",
  name: "Instituições de Ensino",
  singular: "Instituição",
  description: "Cadastro geral e controle de escolas e unidades de ensino da rede.",
  listFields: ["inep", "nome", "tipo_dependencia", "municipio", "diretor_responsavel", "situacao_funcionamento"],
  searchFields: ["nome", "inep", "municipio", "diretor_responsavel"],
  titleField: "nome",
  printTitle: "FICHA DA INSTITUIÇÃO DE ENSINO",
  model: {
    code: "MODELO 003",
    name: "INSTITUIÇÕES DE ENSINO",
    version: "1.0.0",
    origin: "Estrutura Padrão do Censo Escolar",
    fields: schoolsFields,
    history: [
      {
        version: "1.0.0",
        date: "2026-11-04",
        author: "Administrador",
        changes: "Criação do modelo oficial de Instituições de Ensino.",
      },
    ],
  },
};
