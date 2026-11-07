import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface User {
  name: string;
  role: "admin" | "profissional" | "gestor";
  matricula?: string;
  cpf?: string;
  inep?: string;
}

interface AuthContextType {
  user: User | null;
  loginAdmin: () => void;
  loginProfissional: (name: string, matricula: string, cpf: string) => void;
  loginGestor: (name: string, inep: string, matricula: string, cpf: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = "sgde-auth-v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // Ignora erro de JSON
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAdmin = () => {
    const adminUser: User = { name: "Administrador", role: "admin" };
    setUser(adminUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
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
    <AuthContext.Provider value={{ user, loginAdmin, loginProfissional, loginGestor, logout, isLoading }}>
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
