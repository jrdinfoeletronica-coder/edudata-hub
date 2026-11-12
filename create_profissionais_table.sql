-- SQL script to create the `profissionais` table with all 39 official fields
-- Adjust data types as needed for your application requirements.
-- This script assumes a Supabase/PostgreSQL database.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- for uuid generation

CREATE TABLE public.profissionais (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Identificação
    PROFISSIONAL_CPF                text,
    PROFISSIONAL_NOME               text,
    PROFISSIONAL_MATRICULA          text,
    PROFISSIONAL_DATA_NASC          date,
    PROFISSIONAL_SEXO               int,   -- 1=Masculino, 2=Feminino, 3=Intersexo, 4=Prefere não informar
    PROFISSIONAL_GENERO             int,   -- 0=Não informado, 1=Cisgênero, 2=Transgênero, 3=Não-binário, 4=Outro, 5=Prefiro não informar
    PROFISSIONAL_RACA_COR           int,   -- 0=Não informado, 1=Branco(a), 2=Preto(a), 3=Pardo(a), 4=Indígena, 5=Amarelo(a)
    PROFISSIONAL_QUILOMBOLA         int,   -- 0=Não informado, 1=Sim, 2=Não
    PROFISSIONAL_DEFICIENCIA        int,   -- 0=Não informado, 1=Baixa visão, 2=Visão monocular, 3=Cegueira, 4=Deficiência auditiva, 5=Surdez, 6=Surdocegueira, 7=Deficiência física, 8=Deficiência intelectual, 9=Transtorno do Espectro Autista (TEA), 10=Altas habilidades/superdotação, 11=Não possui

    -- Escolaridade e formação
    CO_NIVEL_ESCOLARIDADE          int,   -- 0=Não informado, 1=Ensino Fundamental Incompleto, 2=Ensino Fundamental Completo, 3=Ensino Médio Incompleto, 4=Ensino Médio Completo, 5=Ensino Técnico Completo, 6=Ensino Superior Incompleto, 7=Ensino Superior Completo, 8=Pós-graduação – Especialização, 9=Pós-graduação – Mestrado, 10=Pós-graduação – Doutorado, 11=Sem instrução
    CO_TIPO_ENSINO_MEDIO          int,   -- 0=Não informado, 1=Regular, 2=Integrado, 3=Concomitante, 4=Subsequente, 5=EJA
    CO_TIPO_FORMACAO_ACADEMICA    int,   -- 0=Não informada, 1=Formação Superior – Tecnológico, 2=Formação Superior – Licenciatura, 3=Formação Superior – Bacharelado, 5= Pós-graduação – Especialização, 6= Pós-graduação – Mestrado, 7= Pós-graduação – Doutorado, 8=Formação Técnica

    -- Dados de vínculo / alocação
    CO_TIPO_VINCULO                int,
    CO_TIPO_JORNADA                int,
    CO_TIPO_ESPECIALIDADE          int,
    CO_TIPO_ALOCACAO               int,
    CO_TIPO_LOCALIDADE             int,
    CO_TIPO_SEDE                  int,
    CO_TIPO_CARGA_HORARIA         int,
    CO_TIPO_SITUACAO_FUNCIONAMENTAL int,

    -- Dados de escola / instituição
    CO_CODIGO_ESCOLA               text,
    CO_NOME_ESCOLA                 text,
    CO_CNPJ_ESCOLA                 text,
    CO_MUNICIPIO_ESCOLA            text,
    CO_UF_ESCOLA                   text,
    CO_COD_MUNICIPIO_ESCOLA        text,
    CO_INEP_ESCOLA                 text,

    -- Outros campos genéricos (adicione conforme necessidade)
    extra_data jsonb,

    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Trigger to auto‑update `updated_at` on row modification
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS trigger AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profissionais_update
BEFORE UPDATE ON public.profissionais
FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

-- Optional: enable Row Level Security (RLS) – configure policies later
-- ALTER TABLE public.profissionais ENABLE ROW LEVEL SECURITY;
