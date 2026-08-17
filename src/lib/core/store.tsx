import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AuditEntry, ImportHistoryEntry, RecordRow } from "@/lib/core/types";

const STORAGE_KEY = "sgde-state-v1";
const CURRENT_USER = "Administrador";

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
        matricula: "10245",
        nome: "Ana Carolina Ferreira Lima",
        cpf: "529.982.247-25",
        data_nascimento: "1985-04-12",
        sexo: "Feminino",
        email: "ana.lima@educacao.gov.br",
        celular: "(84) 99812-4477",
        municipio: "Natal",
        uf: "RN",
        cargo: "Professora",
        funcao: "Docente",
        especialidade: "Anos Iniciais",
        vinculo: "Efetivo",
        carga_horaria: "30",
        data_admissao: "2012-03-01",
        situacao: "Ativo",
        lotacao_inep: "24012345",
        lotacao_escola: "E.M. Monteiro Lobato",
        escolaridade: "Especialização",
        curso_formacao: "Pedagogia",
      },
      {
        id: "p2",
        matricula: "10388",
        nome: "Marcos Vinícius Souza Andrade",
        cpf: "168.995.350-09",
        data_nascimento: "1979-11-03",
        sexo: "Masculino",
        email: "marcos.andrade@educacao.gov.br",
        municipio: "Parnamirim",
        uf: "RN",
        cargo: "Coordenador Pedagógico",
        funcao: "Coordenação",
        vinculo: "Efetivo",
        carga_horaria: "40",
        data_admissao: "2008-08-15",
        situacao: "Ativo",
        lotacao_inep: "24098765",
        lotacao_escola: "E.M. Castro Alves",
        escolaridade: "Mestrado",
        curso_formacao: "Educação",
      },
      {
        id: "p3",
        matricula: "10920",
        nome: "Juliana Ribeiro Nascimento",
        cpf: "398.303.610-05",
        data_nascimento: "1992-07-21",
        sexo: "Feminino",
        cargo: "Professora",
        especialidade: "Matemática",
        vinculo: "Contrato temporário",
        carga_horaria: "20",
        data_admissao: "2023-02-06",
        situacao: "Afastado",
        lotacao_inep: "24012345",
        lotacao_escola: "E.M. Monteiro Lobato",
        escolaridade: "Superior",
        curso_formacao: "Licenciatura em Matemática",
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
      ({ ...entry, id: uid(), datetime: now(), user: CURRENT_USER }) as AuditEntry,
    [],
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
          records: { ...s.records, [moduleId]: list.map((r) => (r.id === id ? { ...r, ...row } : r)) },
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
            user: CURRENT_USER,
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
      user: CURRENT_USER,
      getRecords: (moduleId) => state.records[moduleId] ?? [],
      createRecord,
      updateRecord,
      deleteRecord,
      bulkImport,
    }),
    [state, createRecord, updateRecord, deleteRecord, bulkImport],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore deve ser usado dentro de StoreProvider");
  return ctx;
}
