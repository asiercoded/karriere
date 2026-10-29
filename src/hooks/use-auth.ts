import { useState, useEffect, useCallback } from "react";

export interface User {
  _id?: string;
  name?: string;
  email?: string;
  role?: "admin" | "user" | "member";
}

const AUTH_STORAGE_KEY = "karriere-user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStorage = () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        setUser(stored ? JSON.parse(stored) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const signIn = useCallback(async (provider: string, formData?: FormData) => {
    setIsLoading(true);
    try {
      const email = formData?.get("email") as string || "student@karriere.in";
      const dummyUser: User = {
        _id: "local_user_1",
        name: email.split("@")[0],
        email,
        role: email.includes("admin") ? "admin" : "user",
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(dummyUser));
      setUser(dummyUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  return {
    isLoading,
    isAuthenticated: Boolean(user),
    user,
    signIn,
    signOut,
  };
}
