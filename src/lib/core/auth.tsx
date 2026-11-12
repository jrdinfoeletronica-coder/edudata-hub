import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/core/supabase";
import bcrypt from "bcryptjs";

export interface User {
  name: string;
  role: "admin" | "profissional" | "gestor";
  matricula?: string;
  cpf?: string;
  inep?: string;
}

export interface AdminAccount {
  id: string;
  name: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  adminAccounts: AdminAccount[];
  loginAdmin: (username?: string, password?: string) => Promise<boolean>;
  createAdminAccount: (name: string, username: string, password: string) => Promise<boolean>;
  deleteAdminAccount: (id: string) => Promise<void>;
  loginProfissional: (name: string, matricula: string, cpf: string) => void;
  loginGestor: (name: string, inep: string, matricula: string, cpf: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = "sgde-auth-v1";
const DEFAULT_ADMINS: AdminAccount[] = [
  {
    id: "adm-1",
    name: "Administrador Geral",
    username: "admin",
    passwordHash: "$2b$10$v00SmCfdNl/8okJnD4TaqO5RODePoXz4HgfXZtVPdhyINVaUMPoQy", // hash for 'admin123'
    createdAt: "2026-08-17",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load default admin accounts directly (no Supabase fetch to avoid RLS issues)
  useEffect(() => {
    setAdminAccounts(DEFAULT_ADMINS);
    setIsLoading(false);
  }, []);

  const loginAdmin = async (username = "admin", password = "admin123") => {
    // Fallback to default admin if the list hasn't been loaded yet
    const adminsList = adminAccounts.length ? adminAccounts : DEFAULT_ADMINS;
    console.log('loginAdmin - adminsList', adminsList);
    const admin = adminsList.find(
      (a) => a.username.toLowerCase() === username.toLowerCase()
    );
    console.log('loginAdmin - found admin', admin);
    if (!admin) return false;
    const match = await bcrypt.compare(password, admin.passwordHash);
    console.log('loginAdmin - bcrypt match', match);
    if (match) {
      const adminUser: User = { name: admin.name, role: "admin" };
      setUser(adminUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
      console.log('loginAdmin - success');
      return true;
    }
    console.log('loginAdmin - fail');
    return false;
  };

  const createAdminAccount = async (name: string, username: string, password: string) => {
    const exists = adminAccounts.some(
      (a) => a.username.toLowerCase() === username.toLowerCase().trim()
    );
    if (exists) return false;
    const hash = await bcrypt.hash(password, 10);
    const newAdmin: AdminAccount = {
      id: "adm-" + Math.random().toString(36).slice(2, 8),
      name: name.trim(),
      username: username.toLowerCase().trim(),
      passwordHash: hash,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    const { error } = await supabase.from("admins").insert(newAdmin);
    if (error) {
      console.error("Supabase insert admin failed", error);
      return false;
    }
    setAdminAccounts((prev) => [...prev, newAdmin]);
    return true;
  };

  const deleteAdminAccount = async (id: string) => {
    if (adminAccounts.length <= 1) return;
    const { error } = await supabase.from("admins").delete().eq("id", id);
    if (error) {
      console.error("Supabase delete admin failed", error);
      return;
    }
    setAdminAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const loginProfissional = (name: string, matricula: string, cpf: string) => {
    const profUser: User = { name, role: "profissional", matricula, cpf };
    setUser(profUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profUser));
  };

  const loginGestor = (name: string, inep: string, matricula: string, cpf: string) => {
    const gestorUser: User = { name, role: "gestor", inep, matricula, cpf };
    setUser(gestorUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(gestorUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminAccounts,
        loginAdmin,
        createAdminAccount,
        deleteAdminAccount,
        loginProfissional,
        loginGestor,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
