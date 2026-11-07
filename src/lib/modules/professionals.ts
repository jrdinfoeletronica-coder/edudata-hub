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

const G1 = "1. IDENTIFICAÇÃO DO PROFISSIONAL";
const G2 = "2. ESCOLARIDADE E FORMAÇÃO DE NÍVEL MÉDIO";
const G3 = "3. ENDEREÇO E LOCALIZAÇÃO";
const G4 = "4. DEFICIÊNCIA E RECURSOS";
const G5 = "5. FORMAÇÃO SUPERIOR / ACADÊMICA";
const G6 = "6. VÍNCULO EMPREGATÍCIO COM A REDE";
const G7 = "7. FUNÇÃO EXERCIDA NA INSTITUIÇÃO/REDE";

export const professionalsFields: FieldDef[] = [
  // 1. Identificação
  f(1, "COL-A", "PROFISSIONAL_CPF", "Número do CPF do Profissional de Educação", G1, "cpf", true, "11 dígitos sem pontuação", { rule: "11 dígitos, obrigatório" }),
  f(2, "COL-B", "PROFISSIONAL_NOME", "Nome Completo do Profissional da Educação", G1, "text", true, "Nome civil completo conforme documento oficial"),
  f(3, "COL-C", "PROFISSIONAL_NOME_SOCIAL", "Nome Social do Profissional da Educação", G1, "text", false, "Nome social declarado pelo profissional"),
  f(4, "COL-D", "PROFISSIONAL_DT_NASCIMENTO", "Data de Nascimento do Profissional da Educação", G1, "date", true, "Data de nascimento no formato AAAA-MM-DD"),
  f(5, "COL-E", "PROFISSIONAL_SEXO", "Sexo do Profissional da Educação", G1, "select", true, "Sexo biológico declarado", {
    options: [
      "1 - Masculino",
      "2 - Feminino",
      "3 - Intersexo",
      "4 - Prefere não informar",
    ],
  }),
  f(6, "COL-F", "PROFISSIONAL_GENERO", "Gênero do Profissional da Educação", G1, "select", false, "Identidade de gênero autodeclarada", {
    options: [
      "0 - Não informado",
      "1 - Cisgênero",
      "2 - Transgênero",
      "3 - Não-binário",
      "4 - Outro",
      "5 - Prefiro não informar",
    ],
  }),
  f(7, "COL-G", "PROFISSIONAL_RACA_COR", "Raça/Cor do Profissional da Educação", G1, "select", true, "Autodeclaração étnico-racial", {
    options: [
      "0 - Não informado",
      "1 - Branco(a)",
      "2 - Preto(a)",
      "3 - Pardo(a)",
      "4 - Indígena",
      "5 - Amarelo(a)",
    ],
  }),
  f(8, "COL-H", "PROFISSIONAL_QUILOMBOLA", "Profissional da Educação se Autodeclara Quilombola", G1, "select", true, "Pertencimento à comunidade remanescente de quilombos", {
    options: [
      "0 - Não informado",
      "1 - Sim",
      "2 - Não",
    ],
  }),
  f(9, "COL-I", "PROFISSIONAL_NACIONALIDADE", "Nacionalidade do Profissional da Educação", G1, "select", true, "Nacionalidade de origem", {
    options: [
      "1 - Brasileira",
      "2 - Brasileira - nascido no exterior ou naturalizado",
      "3 - Estrangeira",
    ],
  }),
  f(10, "COL-J", "PROFISSIONAL_TELEFONE", "Telefone de Contato do Profissional da Educação", G1, "phone", false, "Telefone fixo ou celular com DDD"),
  f(11, "COL-K", "PROFISSIONAL_E_MAIL", "E-mail do Profissional da Educação", G1, "email", false, "Endereço eletrônico de contato"),

  // 2. Escolaridade
  f(12, "COL-L", "CO_NIVEL_ESCOLARIDADE", "Nível de Escolaridade do Profissional da Educação", G2, "select", true, "Maior nível de escolaridade concluído", {
    options: [
      "0 - Não informado",
      "1 - Ensino Fundamental Incompleto",
      "2 - Ensino Fundamental Completo",
      "3 - Ensino Médio Incompleto",
      "4 - Ensino Médio Completo",
      "5 - Ensino Técnico Completo",
      "6 - Ensino Superior Incompleto",
      "7 - Ensino Superior Completo",
      "8 - Pós-graduação – Especialização",
      "9 - Pós-graduação – Mestrado",
      "10 - Pós-graduação – Doutorado",
      "11 - Sem instrução",
    ],
  }),
  f(13, "COL-M", "CO_TIPO_ENSINO_MEDIO", "Tipo de Ensino Médio Cursado pelo Profissional", G2, "select", true, "Modalidade do ensino médio", {
    options: [
      "0 - Não informado",
      "1 - Formação geral",
      "2 - Modalidade normal / magistério",
      "3 - Curso técnico",
      "4 - Magistério indígena – modalidade normal",
    ],
  }),
  f(14, "COL-N", "NATUREZA_INSTITUICAO_MEDIO_PROFISSIONAL", "Natureza Administrativa da Instituição do Ensino Médio", G2, "select", true, "Dependência administrativa da escola de nível médio", {
    options: [
      "0 - Não informada",
      "1 - Pública",
      "2 - Privada",
    ],
  }),

  // 3. Endereço e Localização
  f(15, "COL-O", "PROFISSIONAL_CO_UF_RES", "Código IBGE do Estado de Residência", G3, "text", true, "Código IBGE da UF (ex: 24 para RN)", { rule: "2 dígitos numéricos" }),
  f(16, "COL-P", "PROFISSIONAL_CO_MUNICIPIO_RES", "Código IBGE do Município de Residência", G3, "text", true, "Código IBGE do Município (7 dígitos)", { rule: "7 dígitos numéricos" }),
  f(17, "COL-Q", "PROFISSIONAL_DS_LOGRADOURO_RES", "Endereço de Residência (Logradouro)", G3, "text", false, "Rua, avenida, travessa, etc."),
  f(18, "COL-R", "PROFISSIONAL_NU_ENDERECO_RES", "Número da Residência do Profissional", G3, "text", false, "Número ou S/N"),
  f(19, "COL-S", "PROFISSIONAL_BAIRRO_RES", "Bairro de Residência do Profissional", G3, "text", false, "Nome do bairro"),
  f(20, "COL-T", "PROFISSIONAL_CEP_RES", "CEP de Residência do Profissional", G3, "text", false, "Código de Endereçamento Postal"),
  f(21, "COL-U", "PROFISSIONAL_LOCALIZACAO_GEOGRAFICA", "Localização Geográfica da Residência", G3, "select", false, "Área de residência urbana ou rural", {
    options: [
      "0 - Não informado",
      "1 - Urbana",
      "2 - Rural",
    ],
  }),
  f(22, "COL-V", "PROFISSIONAL_LOCALIZACAO_DIFERENCIADA", "Localização Diferenciada da Residência", G3, "select", false, "Territórios tradicionais ou diferenciados", {
    options: [
      "0 - Não informado",
      "1 - Não está em área de localização diferenciada",
      "2 - Comunidade quilombola",
      "3 - Terra indígena",
      "4 - Área de assentamento",
      "5 - Área onde se localizam povos e comunidades tradicionais",
    ],
  }),

  // 4. Deficiência
  f(23, "COL-W", "PROFISSIONAL_DEFICIENCIA", "Profissional com Deficiência, TEA ou Altas Habilidades", G4, "select", true, "Condição declarada", {
    options: [
      "0 - Não informado",
      "1 - Baixa visão",
      "2 - Visão monocular",
      "3 - Cegueira",
      "4 - Deficiência auditiva",
      "5 - Surdez",
      "6 - Surdocegueira",
      "7 - Deficiência física",
      "8 - Deficiência intelectual",
      "9 - Transtorno do Espectro Autista (TEA)",
      "10 - Altas habilidades/superdotação",
      "11 - Não possui",
    ],
  }),

  // 5. Formação Acadêmica
  f(24, "COL-X", "CO_TIPO_FORMACAO_ACADEMICA", "Tipo de Formação Acadêmica", G5, "select", true, "Grau da formação acadêmica superior", {
    options: [
      "0 - Não informada",
      "1 - Formação Superior – Tecnológico",
      "2 - Formação Superior – Licenciatura",
      "3 - Formação Superior – Bacharelado",
      "5 - Pós-graduação – Especialização",
      "6 - Pós-graduação – Mestrado",
      "7 - Pós-graduação – Doutorado",
      "8 - Formação Técnica",
    ],
  }),
  f(25, "COL-Y", "CO_AREA_CONHECIMENTO_FORMACAO_ACADEMICA", "Área de Conhecimento da Formação Acadêmica", G5, "select", true, "Grande área do conhecimento", {
    options: [
      "0 - Não informada",
      "1 - Educação",
      "2 - Artes e humanidades",
      "3 - Ciências sociais, comunicação e informação",
      "4 - Negócios, administração e direito",
      "5 - Ciências naturais, matemática e estatística",
      "6 - Computação e Tecnologias da Informação e Comunicação (TIC)",
      "7 - Engenharia, produção e construção",
      "8 - Agricultura, silvicultura, pesca e veterinária",
      "9 - Saúde e bem-estar",
      "10 - Serviços",
      "99 - Programas básicos",
    ],
  }),
  f(26, "COL-Z", "NO_INSTITUICAO_ENSINO_FORMACAO_ACADEMICA", "Nome da Instituição de Ensino Superior da Formação", G5, "text", false, "Nome da faculdade ou universidade"),
  f(27, "COL-AA", "NATUREZA_INSTITUICAO_SUPERIOR_PROFISSIONAL", "Natureza Administrativa da Instituição de Ensino Superior", G5, "select", false, "Dependência da faculdade", {
    options: [
      "0 - Não informada",
      "1 - Pública",
      "2 - Privada",
    ],
  }),
  f(28, "COL-AB", "ANO_INICIO_FORMACAO_ACADEMICA", "Ano de Início do Ensino Superior", G5, "number", false, "Ano em que ingressou no curso"),
  f(29, "COL-AC", "ANO_CONCLUSAO_FORMACAO_ACADEMICA", "Ano de Conclusão do Ensino Superior", G5, "number", true, "Ano em que concluiu a graduação"),

  // 6. Vínculo Empregatício
  f(30, "COL-AD", "CO_ENTIDADE", "Código INEP da Instituição ou Rede de Lotação", G6, "text", true, "Código INEP com 8 dígitos da escola onde está lotado", { rule: "8 dígitos numéricos" }),
  f(31, "COL-AE", "CO_TIPO_VINCULO", "Tipo de Vínculo Empregatício com a Rede de Ensino", G6, "select", true, "Regime de contratação", {
    options: [
      "0 - Não informado",
      "1 - Estatutário efetivo",
      "2 - Contrato temporário",
      "3 - Terceirizado",
      "4 - Contrato CLT",
      "5 - Cargo comissionado",
    ],
  }),
  f(32, "COL-AF", "SITUACAO_VINCULO_PROFISSIONAL_REDE", "Situação do Vínculo com a Rede de Ensino", G6, "select", true, "Situação funcional atual", {
    options: [
      "0 - Não aplicável",
      "1 - Ativo",
      "2 - Inativo",
      "3 - Suspenso",
      "4 - Licença",
      "5 - Readaptado",
    ],
  }),
  f(33, "COL-AG", "DATA_INICIO_VINCULO_PROFISSIONAL_REDE", "Data de Início do Vínculo com a Rede de Ensino", G6, "date", true, "Data de admissão / posse"),
  f(34, "COL-AH", "DATA_FIM_VINCULO_PROFISSIONAL_REDE", "Data do Fim do Vínculo com a Rede de Ensino", G6, "date", false, "Data de encerramento, se houver"),

  // 7. Função Exercida
  f(35, "COL-AI", "CO_FUNCAO", "Função Exercida pelo Profissional na Rede/Escola", G7, "select", true, "Cargo ou função principal", {
    options: [
      "1 - Docente",
      "2 - Tradutor(a) e Intérprete de Libras",
      "3 - Guia-Intérprete",
      "4 - Auxiliar/assistente educacional",
      "5 - Docente titular – coordenador(a) de tutoria (EaD)",
      "6 - Profissional de apoio escolar para alunos com deficiência",
      "7 - Profissional/monitor de atividade complementar",
      "8 - Docente tutor(a) – auxiliar (EaD)",
      "9 - Instrutor(a) de educação profissional",
      "10 - Diretor(a)",
      "11 - Coordenador(a) Pedagógico(a)",
      "12 - Secretário(a) Escolar",
      "14 - Gestor(a) na Secretaria de Educação",
      "15 - Merendeira",
      "16 - Vice-diretor(a)",
      "17 - Auxiliar na escola",
      "99 - Outros",
    ],
  }),
  f(36, "COL-AJ", "DATA_INGRESSO", "Data de Início da Função Exercida", G7, "date", true, "Data em que assumiu a função"),
  f(37, "COL-AK", "DATA_FIM", "Data do Fim da Função Exercida", G7, "date", false, "Data de término na função"),
  f(38, "COL-AL", "CARGA_HORARIA_SEMANAL", "Carga Horária Semanal de Trabalho", G7, "number", false, "Carga horária semanal em horas"),
  f(39, "COL-AM", "PROFISSIONAL_IDENTIFICACAO_INSTITUICAO", "Número de Identificação (ID / Matrícula) do Profissional", G7, "text", false, "Matrícula funcional gerada pela rede"),
];

export const professionalsModule: ModuleDef = {
  id: "profissionais",
  name: "Profissionais da Educação",
  singular: "Profissional",
  description:
    "Cadastro, gestão, importação, exportação e impressão oficial dos profissionais da rede no padrão Censo Escolar / SEDUC.",
  listFields: [
    "PROFISSIONAL_CPF",
    "PROFISSIONAL_NOME",
    "CO_FUNCAO",
    "CO_TIPO_VINCULO",
    "CO_ENTIDADE",
    "SITUACAO_VINCULO_PROFISSIONAL_REDE",
  ],
  searchFields: [
    "PROFISSIONAL_NOME",
    "PROFISSIONAL_CPF",
    "PROFISSIONAL_IDENTIFICACAO_INSTITUICAO",
    "CO_ENTIDADE",
    "CO_FUNCAO",
  ],
  titleField: "PROFISSIONAL_NOME",
  printTitle: "FICHA DO PROFISSIONAL DA EDUCAÇÃO (CENSO ESCOLAR / SEDUC)",
  model: {
    code: "MODELO 001 - SEDUC",
    name: "PROFISSIONAIS DA EDUCAÇÃO - CENSO",
    version: "2.0.0",
    origin: "Matriz Oficial Censo Escolar / MEC Normas (39 colunas)",
    fields: professionalsFields,
    history: [
      {
        version: "2.0.0",
        date: "2026-11-07",
        author: "Administrador",
        changes:
          "Atualização dos 39 campos para a nomenclatura técnica oficial da planilha SEDUC/Censo, com domínios de códigos numéricos padronizados.",
      },
      {
        version: "1.0.0",
        date: "2026-08-17",
        author: "Administrador",
        changes: "Criação inicial do modelo com 39 campos.",
      },
    ],
  },
};
