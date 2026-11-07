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

const G1 = "IDENTIFICAÇÃO DO ALUNO";
const G2 = "INFORMAÇÕES ACADÊMICAS";
const G3 = "CONTATO DO RESPONSÁVEL";

export const alunosFields: FieldDef[] = [
  f(1, "A-001", "matricula_aluno", "Matrícula do Aluno", G1, "text", true, "Número de matrícula do aluno na rede", { rule: "Único no módulo" }),
  f(2, "A-002", "nome", "Nome completo", G1, "text", true, "Nome civil completo do aluno"),
  f(3, "A-003", "cpf", "CPF", G1, "cpf", false, "Cadastro de Pessoa Física do aluno (se houver)"),
  f(4, "A-004", "data_nascimento", "Data de nascimento", G1, "date", true, "Data de nascimento do aluno"),
  f(5, "A-005", "sexo", "Sexo", G1, "select", true, "Sexo declarado", { options: ["Feminino", "Masculino", "Não informado"] }),
  
  f(6, "A-006", "lotacao_inep", "Código INEP da Escola", G2, "text", true, "Código INEP da instituição onde o aluno estuda", { rule: "8 dígitos" }),
  f(7, "A-007", "turma", "Turma", G2, "text", true, "Turma na qual o aluno está matriculado"),
  f(8, "A-008", "situacao", "Situação", G2, "select", true, "Situação acadêmica atual", { options: ["Cursando", "Aprovado", "Reprovado", "Transferido", "Evadido"] }),

  f(9, "A-009", "nome_responsavel", "Nome do Responsável", G3, "text", true, "Nome completo do responsável legal"),
  f(10, "A-010", "cpf_responsavel", "CPF do Responsável", G3, "cpf", true, "CPF do responsável"),
  f(11, "A-011", "telefone_responsavel", "Telefone do Responsável", G3, "phone", true, "Telefone de contato do responsável"),
];

export const alunosModule: ModuleDef = {
  id: "alunos",
  name: "Alunos",
  singular: "Aluno",
  description: "Cadastro e gestão dos alunos da rede de ensino.",
  listFields: ["matricula_aluno", "nome", "turma", "situacao", "nome_responsavel"],
  searchFields: ["nome", "matricula_aluno", "cpf", "nome_responsavel", "lotacao_inep"],
  titleField: "nome",
  printTitle: "FICHA DO ALUNO",
  model: {
    code: "MODELO 002",
    name: "ALUNOS",
    version: "1.0.0",
    origin: "Estrutura Inicial Padrão",
    fields: alunosFields,
    history: [
      {
        version: "1.0.0",
        date: "2026-08-17",
        author: "Administrador",
        changes: "Criação do modelo básico inicial para alunos.",
      },
    ],
  },
};
