import { useContext } from "react";
import { AuthContext, type AuthContextType } from "../context/AuthContext";

export function useAuth() {
  const ctx = useContext<AuthContextType | null>(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
