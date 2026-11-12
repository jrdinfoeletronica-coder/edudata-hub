-- SQL script to create the `admins` table for Supabase
-- Simple table that stores admin users with bcrypt‑hashed passwords.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- for uuid generation

CREATE TABLE public.admins (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    username text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    created_at date NOT NULL DEFAULT now()
);

-- Insert the default admin (admin / admin123) – the password hash matches the one used in the code.
INSERT INTO public.admins (name, username, password_hash)
VALUES (
    'Administrador Geral',
    'admin',
    '$2a$10$e0NRW1k3d2cKGi6S8J2bHeQqs6IbhEwK9lX4D0Rz8sUeH6JfKj1Dm'  -- hash for "admin123"
)
ON CONFLICT DO NOTHING;

-- (Optional) Disable Row Level Security for quick testing.
-- ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
