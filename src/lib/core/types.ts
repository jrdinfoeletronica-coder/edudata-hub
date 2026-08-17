export type FieldType =
  | "text"
  | "longtext"
  | "number"
  | "date"
  | "cpf"
  | "email"
  | "phone"
  | "select";

export interface FieldDef {
  /** Identificador interno estável do campo */
  id: string;
  /** Nome técnico oficial (preservado da planilha de origem) */
  tech: string;
  /** Nome amigável exibido na interface */
  label: string;
  description: string;
  type: FieldType;
  required: boolean;
  /** Código oficial do campo na planilha (ex.: P-001) */
  code: string;
  /** Grupo / seção da planilha */
  group: string;
  /** Ordem de apresentação (idêntica à planilha original) */
  order: number;
  options?: string[];
  /** Regra de validação legível */
  rule?: string;
}

export interface ModelVersion {
  version: string;
  date: string;
  author: string;
  changes: string;
}

export interface ModelDef {
  /** Código do modelo, ex.: "MODELO 001" */
  code: string;
  name: string;
  version: string;
  origin: string;
  fields: FieldDef[];
  history: ModelVersion[];
}

export interface ModuleDef {
  id: string;
  name: string;
  singular: string;
  description: string;
  /** Campos exibidos na listagem */
  listFields: string[];
  /** Campos considerados na busca global */
  searchFields: string[];
  /** Campo usado como título do registro */
  titleField: string;
  printTitle: string;
  model: ModelDef;
}

export type RecordRow = Record<string, string> & { id: string };

export interface ImportHistoryEntry {
  id: string;
  user: string;
  datetime: string;
  file: string;
  moduleId: string;
  total: number;
  imported: number;
  rejected: number;
  status: "Concluída" | "Concluída com erros" | "Falhou";
  errors: string[];
}

export interface AuditEntry {
  id: string;
  user: string;
  datetime: string;
  moduleId: string;
  recordId: string;
  operation: "Criação" | "Alteração" | "Exclusão" | "Importação";
  before: string;
  after: string;
}
