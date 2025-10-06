import type { Session, User } from "@supabase/supabase-js";

export interface Accounts {
  uid: string;
  role: "super-admins" | "admins" | "karyawan";
  display_name: string;
  email: string;
  photo_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  logout: () => Promise<void>;
  profile: Accounts | null;
  refreshProfile: () => Promise<void>;

  email: string;
  password: string;
  showPassword: boolean;
  loadingLogin: boolean;
  error: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setShowPassword: (show: boolean | ((prev: boolean) => boolean)) => void;
  setError: (error: string) => void;
  handleLogin: (email: string, password: string) => Promise<void>;
  clearForm: () => void;

  // New unified auth handlers
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (params: { fullName: string; email: string; password: string; role?: Accounts['role'] }) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
