import { createContext, useState, useEffect} from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    console.log("INITIAL localStorage token:", localStorage.getItem("token"));
  
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  
    useEffect(() => {
      console.log("AuthContext token state changed:", token);
    }, [token]);
  
    const login = (jwt: string) => {
      console.log("login() called with token:", jwt);
      localStorage.setItem("token", jwt);
      console.log("Token saved to localStorage:", localStorage.getItem("token"));
      setToken(jwt);
    };
  
    const logout = () => {
      console.log("logout() called");
      localStorage.removeItem("token");
      setToken(null);
    };
  
    return (
      <AuthContext.Provider value={{ token, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  