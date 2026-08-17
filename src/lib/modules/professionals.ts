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

const G1 = "IDENTIFICAÇÃO";
const G2 = "CONTATO E ENDEREÇO";
const G3 = "DADOS FUNCIONAIS";
const G4 = "FORMAÇÃO E OBSERVAÇÕES";

export const professionalsFields: FieldDef[] = [
  f(1, "P-001", "matricula", "Matrícula", G1, "text", true, "Número de matrícula funcional do profissional", { rule: "Único no módulo" }),
  f(2, "P-002", "nome", "Nome completo", G1, "text", true, "Nome civil completo conforme documento oficial"),
  f(3, "P-003", "nome_social", "Nome social", G1, "text", false, "Nome social, quando houver"),
  f(4, "P-004", "cpf", "CPF", G1, "cpf", true, "Cadastro de Pessoa Física", { rule: "11 dígitos, único no módulo" }),
  f(5, "P-005", "rg", "RG", G1, "text", false, "Registro Geral / documento de identidade"),
  f(6, "P-006", "orgao_expedidor", "Órgão expedidor", G1, "text", false, "Órgão emissor do documento de identidade"),
  f(7, "P-007", "data_nascimento", "Data de nascimento", G1, "date", true, "Data de nascimento do profissional"),
  f(8, "P-008", "sexo", "Sexo", G1, "select", false, "Sexo declarado", { options: ["Feminino", "Masculino", "Não informado"] }),
  f(9, "P-009", "estado_civil", "Estado civil", G1, "select", false, "Estado civil declarado", {
    options: ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "União estável"],
  }),
  f(10, "P-010", "nacionalidade", "Nacionalidade", G1, "text", false, "Nacionalidade declarada"),
  f(11, "P-011", "naturalidade", "Naturalidade", G1, "text", false, "Município de nascimento"),
  f(12, "P-012", "nome_mae", "Nome da mãe", G1, "text", false, "Filiação materna"),
  f(13, "P-013", "nome_pai", "Nome do pai", G1, "text", false, "Filiação paterna"),

  f(14, "P-014", "email", "E-mail", G2, "email", false, "Endereço eletrônico de contato", { rule: "Formato de e-mail válido" }),
  f(15, "P-015", "telefone", "Telefone", G2, "phone", false, "Telefone fixo de contato"),
  f(16, "P-016", "celular", "Celular", G2, "phone", false, "Telefone celular de contato"),
  f(17, "P-017", "cep", "CEP", G2, "text", false, "Código de endereçamento postal"),
  f(18, "P-018", "logradouro", "Logradouro", G2, "text", false, "Rua, avenida, travessa etc."),
  f(19, "P-019", "numero", "Número", G2, "text", false, "Número do imóvel"),
  f(20, "P-020", "complemento", "Complemento", G2, "text", false, "Complemento do endereço"),
  f(21, "P-021", "bairro", "Bairro", G2, "text", false, "Bairro de residência"),
  f(22, "P-022", "municipio", "Município", G2, "text", false, "Município de residência"),
  f(23, "P-023", "uf", "UF", G2, "text", false, "Unidade federativa", { rule: "2 caracteres" }),

  f(24, "P-024", "cargo", "Cargo", G3, "text", true, "Cargo ocupado pelo profissional"),
  f(25, "P-025", "funcao", "Função", G3, "text", false, "Função exercida"),
  f(26, "P-026", "especialidade", "Especialidade", G3, "text", false, "Área/disciplina de atuação"),
  f(27, "P-027", "vinculo", "Vínculo", G3, "select", true, "Tipo de vínculo empregatício", {
    options: ["Efetivo", "Contrato temporário", "Comissionado", "Estágio", "Terceirizado"],
  }),
  f(28, "P-028", "regime_trabalho", "Regime de trabalho", G3, "text", false, "Regime jurídico/contratual"),
  f(29, "P-029", "carga_horaria", "Carga horária semanal", G3, "number", false, "Carga horária semanal em horas"),
  f(30, "P-030", "data_admissao", "Data de admissão", G3, "date", false, "Data de início do vínculo"),
  f(31, "P-031", "data_desligamento", "Data de desligamento", G3, "date", false, "Data de encerramento do vínculo, se houver"),
  f(32, "P-032", "situacao", "Situação", G3, "select", true, "Situação funcional atual", {
    options: ["Ativo", "Afastado", "Licença", "Desligado"],
  }),
  f(33, "P-033", "lotacao_inep", "Código INEP da lotação", G3, "text", false, "Código INEP da instituição de lotação", {
    rule: "8 dígitos — chave de relacionamento com Instituições de Ensino",
  }),
  f(34, "P-034", "lotacao_escola", "Escola de lotação", G3, "text", false, "Nome da instituição de lotação"),

  f(35, "P-035", "escolaridade", "Escolaridade", G4, "select", false, "Maior nível de escolaridade concluído", {
    options: ["Fundamental", "Médio", "Magistério", "Superior", "Especialização", "Mestrado", "Doutorado"],
  }),
  f(36, "P-036", "curso_formacao", "Curso de formação", G4, "text", false, "Curso de formação principal"),
  f(37, "P-037", "instituicao_formacao", "Instituição de formação", G4, "text", false, "Instituição onde concluiu a formação"),
  f(38, "P-038", "ano_conclusao", "Ano de conclusão", G4, "number", false, "Ano de conclusão do curso de formação"),
  f(39, "P-039", "observacoes", "Observações", G4, "longtext", false, "Informações complementares sobre o profissional"),
];

export const professionalsModule: ModuleDef = {
  id: "profissionais",
  name: "Profissionais da Educação",
  singular: "Profissional",
  description:
    "Cadastro, gestão, importação, exportação e impressão dos profissionais da rede de ensino.",
  listFields: ["matricula", "nome", "cpf", "cargo", "vinculo", "lotacao_escola", "situacao"],
  searchFields: ["nome", "cpf", "matricula", "cargo", "lotacao_escola", "lotacao_inep"],
  titleField: "nome",
  printTitle: "FICHA DO PROFISSIONAL DA EDUCAÇÃO",
  model: {
    code: "MODELO 001",
    name: "PROFISSIONAIS DA EDUCAÇÃO",
    version: "1.0.0",
    origin: "Planilha PROFISSIONAIS_V1 (39 campos)",
    fields: professionalsFields,
    history: [
      {
        version: "1.0.0",
        date: "2026-08-17",
        author: "Administrador",
        changes: "Criação do modelo com os 39 campos oficiais da planilha de origem.",
      },
    ],
  },
};
