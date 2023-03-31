import { createContext } from "react";

import { Credentials, User } from "../types";

interface AuthContextType {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  onLogin: (credentials: Credentials) => Promise<void>;
  onLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null!);

export default AuthContext;
