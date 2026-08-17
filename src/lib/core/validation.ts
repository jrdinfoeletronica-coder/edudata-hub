import type { FieldDef, RecordRow } from "@/lib/core/types";

export const onlyDigits = (v: string) => (v ?? "").replace(/\D/g, "");

export const formatCpf = (v: string) => {
  const d = onlyDigits(v).slice(0, 11);
  return d.replace(/(\d{3})(\d{3})?(\d{3})?(\d{2})?/, (_m, a, b, c, e) =>
    [a, b, c].filter(Boolean).join(".") + (e ? "-" + e : ""),
  );
};

export const isValidCpf = (v: string) => {
  const d = onlyDigits(v);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(d[i]) * (len + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(9) === Number(d[9]) && calc(10) === Number(d[10]);
};

export function validateField(field: FieldDef, raw: string): string | null {
  const value = (raw ?? "").trim();
  if (!value) return field.required ? `${field.label} é obrigatório.` : null;
  switch (field.type) {
    case "cpf":
      return isValidCpf(value) ? null : "CPF inválido.";
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "E-mail inválido.";
    case "number":
      return Number.isNaN(Number(value.replace(",", "."))) ? "Valor numérico inválido." : null;
    case "date":
      return /^\d{4}-\d{2}-\d{2}$/.test(value) ? null : "Data deve estar no formato AAAA-MM-DD.";
    case "select":
      return field.options && !field.options.includes(value)
        ? `Valor não permitido. Opções: ${field.options.join(", ")}`
        : null;
    default:
      return null;
  }
}

export function validateRecord(fields: FieldDef[], row: Partial<RecordRow>) {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const err = validateField(field, String(row[field.tech] ?? ""));
    if (err) errors[field.tech] = err;
  }
  return errors;
}
