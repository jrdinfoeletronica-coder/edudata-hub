import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AuditEntry, ImportHistoryEntry, RecordRow } from "@/lib/core/types";
import { useAuth } from "./auth";

const STORAGE_KEY = "sgde-state-v1";

interface State {
  records: Record<string, RecordRow[]>;
  imports: ImportHistoryEntry[];
  audit: AuditEntry[];
}

const seed: State = {
  records: {
    profissionais: [
      {
        id: "p1",
        PROFISSIONAL_IDENTIFICACAO_INSTITUICAO: "10245",
        PROFISSIONAL_NOME: "Ana Carolina Ferreira Lima",
        PROFISSIONAL_CPF: "529.982.247-25",
        PROFISSIONAL_DT_NASCIMENTO: "1985-04-12",
        PROFISSIONAL_SEXO: "2 - Feminino",
        PROFISSIONAL_GENERO: "1 - Cisgênero",
        PROFISSIONAL_RACA_COR: "1 - Branco(a)",
        PROFISSIONAL_QUILOMBOLA: "2 - Não",
        PROFISSIONAL_NACIONALIDADE: "1 - Brasileira",
        PROFISSIONAL_E_MAIL: "ana.lima@educacao.gov.br",
        PROFISSIONAL_TELEFONE: "(84) 99812-4477",
        CO_NIVEL_ESCOLARIDADE: "8 - Pós-graduação – Especialização",
        CO_TIPO_ENSINO_MEDIO: "2 - Modalidade normal / magistério",
        NATUREZA_INSTITUICAO_MEDIO_PROFISSIONAL: "1 - Pública",
        PROFISSIONAL_CO_UF_RES: "24",
        PROFISSIONAL_CO_MUNICIPIO_RES: "2408102",
        PROFISSIONAL_DEFICIENCIA: "11 - Não possui",
        CO_TIPO_FORMACAO_ACADEMICA: "2 - Formação Superior – Licenciatura",
        CO_AREA_CONHECIMENTO_FORMACAO_ACADEMICA: "1 - Educação",
        CO_ENTIDADE: "24012345",
        CO_TIPO_VINCULO: "1 - Estatutário efetivo",
        SITUACAO_VINCULO_PROFISSIONAL_REDE: "1 - Ativo",
        DATA_INICIO_VINCULO_PROFISSIONAL_REDE: "2012-03-01",
        CO_FUNCAO: "1 - Docente",
        DATA_INGRESSO: "2012-03-01",
        CARGA_HORARIA_SEMANAL: "30",
        // Campos legados para compatibilidade com login
        matricula: "10245",
        nome: "Ana Carolina Ferreira Lima",
        cpf: "529.982.247-25",
        lotacao_inep: "24012345",
      },
      {
        id: "p2",
        PROFISSIONAL_IDENTIFICACAO_INSTITUICAO: "10388",
        PROFISSIONAL_NOME: "Marcos Vinícius Souza Andrade",
        PROFISSIONAL_CPF: "168.995.350-09",
        PROFISSIONAL_DT_NASCIMENTO: "1979-11-03",
        PROFISSIONAL_SEXO: "1 - Masculino",
        PROFISSIONAL_GENERO: "1 - Cisgênero",
        PROFISSIONAL_RACA_COR: "3 - Pardo(a)",
        PROFISSIONAL_QUILOMBOLA: "2 - Não",
        PROFISSIONAL_NACIONALIDADE: "1 - Brasileira",
        PROFISSIONAL_E_MAIL: "marcos.andrade@educacao.gov.br",
        CO_NIVEL_ESCOLARIDADE: "9 - Pós-graduação – Mestrado",
        CO_TIPO_ENSINO_MEDIO: "1 - Formação geral",
        NATUREZA_INSTITUICAO_MEDIO_PROFISSIONAL: "1 - Pública",
        PROFISSIONAL_CO_UF_RES: "24",
        PROFISSIONAL_CO_MUNICIPIO_RES: "2403251",
        PROFISSIONAL_DEFICIENCIA: "11 - Não possui",
        CO_TIPO_FORMACAO_ACADEMICA: "2 - Formação Superior – Licenciatura",
        CO_AREA_CONHECIMENTO_FORMACAO_ACADEMICA: "1 - Educação",
        CO_ENTIDADE: "24098765",
        CO_TIPO_VINCULO: "1 - Estatutário efetivo",
        SITUACAO_VINCULO_PROFISSIONAL_REDE: "1 - Ativo",
        DATA_INICIO_VINCULO_PROFISSIONAL_REDE: "2008-08-15",
        CO_FUNCAO: "11 - Coordenador(a) Pedagógico(a)",
        DATA_INGRESSO: "2008-08-15",
        CARGA_HORARIA_SEMANAL: "40",
        matricula: "10388",
        nome: "Marcos Vinícius Souza Andrade",
        cpf: "168.995.350-09",
        lotacao_inep: "24098765",
      },
      {
        id: "p3",
        PROFISSIONAL_IDENTIFICACAO_INSTITUICAO: "140101",
        PROFISSIONAL_NOME: "Jose Jaci de Souza Santana Junior",
        PROFISSIONAL_CPF: "105.288.007-01",
        PROFISSIONAL_DT_NASCIMENTO: "1985-03-11",
        PROFISSIONAL_SEXO: "1 - Masculino",
        PROFISSIONAL_GENERO: "1 - Cisgênero",
        PROFISSIONAL_RACA_COR: "3 - Pardo(a)",
        PROFISSIONAL_QUILOMBOLA: "2 - Não",
        PROFISSIONAL_NACIONALIDADE: "1 - Brasileira",
        CO_NIVEL_ESCOLARIDADE: "7 - Ensino Superior Completo",
        CO_TIPO_ENSINO_MEDIO: "3 - Curso técnico",
        NATUREZA_INSTITUICAO_MEDIO_PROFISSIONAL: "1 - Pública",
        PROFISSIONAL_CO_UF_RES: "24",
        PROFISSIONAL_CO_MUNICIPIO_RES: "2408102",
        PROFISSIONAL_DEFICIENCIA: "11 - Não possui",
        CO_TIPO_FORMACAO_ACADEMICA: "1 - Formação Superior – Tecnológico",
        CO_AREA_CONHECIMENTO_FORMACAO_ACADEMICA: "6 - Computação e Tecnologias da Informação e Comunicação (TIC)",
        NO_INSTITUICAO_ENSINO_FORMACAO_ACADEMICA: "ESTÁCIO DE SÁ",
        ANO_CONCLUSAO_FORMACAO_ACADEMICA: "2023",
        CO_ENTIDADE: "24012345",
        CO_TIPO_VINCULO: "1 - Estatutário efetivo",
        SITUACAO_VINCULO_PROFISSIONAL_REDE: "1 - Ativo",
        DATA_INICIO_VINCULO_PROFISSIONAL_REDE: "2016-08-15",
        CO_FUNCAO: "1 - Docente",
        DATA_INGRESSO: "2016-08-15",
        CARGA_HORARIA_SEMANAL: "30",
        matricula: "140101",
        nome: "Jose Jaci de Souza Santana Junior",
        cpf: "105.288.007-01",
        lotacao_inep: "24012345",
      },
    ],
    alunos: [
      {
        id: "a1",
        matricula_aluno: "202601",
        nome: "Lucas Gabriel Santos",
        cpf: "098.765.432-10",
        data_nascimento: "2015-05-18",
        sexo: "Masculino",
        lotacao_inep: "24012345",
        turma: "5º Ano A",
        situacao: "Cursando",
        nome_responsavel: "Mariana Santos",
        cpf_responsavel: "555.444.333-22",
        telefone_responsavel: "(84) 98877-6655",
      },
      {
        id: "a2",
        matricula_aluno: "202602",
        nome: "Beatriz Oliveira Costa",
        cpf: "123.456.789-00",
        data_nascimento: "2016-09-22",
        sexo: "Feminino",
        lotacao_inep: "24012345",
        turma: "4º Ano B",
        situacao: "Cursando",
        nome_responsavel: "Carlos Alberto Costa",
        cpf_responsavel: "777.888.999-11",
        telefone_responsavel: "(84) 99988-1122",
      },
    ],
    instituicoes: [
      {
        id: "esc1",
        inep: "24012345",
        nome: "Escola Municipal Monteiro Lobato",
        sigla: "EMML",
        tipo_dependencia: "Municipal",
        situacao_funcionamento: "Em Atividade",
        cep: "59000-000",
        endereco: "Rua das Flores, 120",
        bairro: "Centro",
        municipio: "Natal",
        uf: "RN",
        telefone: "(84) 3232-1000",
        email: "monteiro.lobato@edu.gov.br",
        diretor_responsavel: "Prof. Marcos Vinícius",
        etapas_atendidas: "Ensino Fundamental I e II",
      },
      {
        id: "esc2",
        inep: "24098765",
        nome: "Escola Municipal Castro Alves",
        sigla: "EMCA",
        tipo_dependencia: "Municipal",
        situacao_funcionamento: "Em Atividade",
        cep: "59140-000",
        endereco: "Av. Principal, 500",
        bairro: "Santos Reis",
        municipio: "Parnamirim",
        uf: "RN",
        telefone: "(84) 3644-2000",
        email: "castro.alves@edu.gov.br",
        diretor_responsavel: "Profa. Juliana Ribeiro",
        etapas_atendidas: "Educação Infantil e Fundamental I",
      },
    ],
  },
  imports: [],
  audit: [],
};

interface Ctx extends State {
  user: string;
  getRecords: (moduleId: string) => RecordRow[];
  createRecord: (moduleId: string, row: Omit<RecordRow, "id">) => RecordRow;
  updateRecord: (moduleId: string, id: string, row: Partial<RecordRow>) => void;
  deleteRecord: (moduleId: string, id: string) => void;
  bulkImport: (
    moduleId: string,
    rows: Omit<RecordRow, "id">[],
    meta: { file: string; rejected: number; total: number; errors: string[] },
  ) => void;
}

const StoreContext = createContext<Ctx | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(seed);
  const { user } = useAuth();
  const currentUser = user?.name || "Sistema";

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw) as State);
    } catch {
      /* estado inicial mantido */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* armazenamento indisponível */
    }
  }, [state]);

  const audit = useCallback(
    (entry: Omit<AuditEntry, "id" | "datetime" | "user">) =>
      ({ ...entry, id: uid(), datetime: now(), user: currentUser }) as AuditEntry,
    [currentUser],
  );

  const createRecord: Ctx["createRecord"] = useCallback(
    (moduleId, row) => {
      const created = { ...row, id: uid() } as RecordRow;
      setState((s) => ({
        ...s,
        records: { ...s.records, [moduleId]: [...(s.records[moduleId] ?? []), created] },
        audit: [
          audit({ moduleId, recordId: created.id, operation: "Criação", before: "—", after: JSON.stringify(row).slice(0, 200) }),
          ...s.audit,
        ],
      }));
      return created;
    },
    [audit],
  );

  const updateRecord: Ctx["updateRecord"] = useCallback(
    (moduleId, id, row) => {
      setState((s) => {
        const list = s.records[moduleId] ?? [];
        const previous = list.find((r) => r.id === id);
        return {
          ...s,
          records: {
            ...s.records,
            [moduleId]: list.map((r) => (r.id === id ? ({ ...r, ...row } as RecordRow) : r)),
          },
          audit: [
            audit({
              moduleId,
              recordId: id,
              operation: "Alteração",
              before: JSON.stringify(previous ?? {}).slice(0, 200),
              after: JSON.stringify({ ...previous, ...row }).slice(0, 200),
            }),
            ...s.audit,
          ],
        };
      });
    },
    [audit],
  );

  const deleteRecord: Ctx["deleteRecord"] = useCallback(
    (moduleId, id) => {
      setState((s) => {
        const list = s.records[moduleId] ?? [];
        const previous = list.find((r) => r.id === id);
        return {
          ...s,
          records: { ...s.records, [moduleId]: list.filter((r) => r.id !== id) },
          audit: [
            audit({ moduleId, recordId: id, operation: "Exclusão", before: JSON.stringify(previous ?? {}).slice(0, 200), after: "—" }),
            ...s.audit,
          ],
        };
      });
    },
    [audit],
  );

  const bulkImport: Ctx["bulkImport"] = useCallback(
    (moduleId, rows, meta) => {
      const created = rows.map((r) => ({ ...r, id: uid() }) as RecordRow);
      setState((s) => ({
        ...s,
        records: { ...s.records, [moduleId]: [...(s.records[moduleId] ?? []), ...created] },
        imports: [
          {
            id: uid(),
            user: currentUser,
            datetime: now(),
            file: meta.file,
            moduleId,
            total: meta.total,
            imported: created.length,
            rejected: meta.rejected,
            status: meta.rejected === 0 ? "Concluída" : created.length ? "Concluída com erros" : "Falhou",
            errors: meta.errors,
          },
          ...s.imports,
        ],
        audit: [
          audit({ moduleId, recordId: `${created.length} registros`, operation: "Importação", before: "—", after: meta.file }),
          ...s.audit,
        ],
      }));
    },
    [audit],
  );

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      user: currentUser,
      getRecords: (moduleId) => state.records[moduleId] ?? [],
      createRecord,
      updateRecord,
      deleteRecord,
      bulkImport,
    }),
    [state, currentUser, createRecord, updateRecord, deleteRecord, bulkImport],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore deve ser usado dentro de StoreProvider");
  return ctx;
}
