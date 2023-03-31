import { useSnackbar } from "notistack";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AuthContext from "../context";
import { readCurrentUser, logIn, logOut } from "../services";
import { Credentials, User } from "../types";

interface AuthProviderProps {
  children: React.ReactElement;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // user
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // get user
  useEffect(() => {
    setError(null);
    setIsLoading(true);
    readCurrentUser()
      .then((data) => setUser(data))
      .catch((err) => {
        setUser(null);
        setError(err?.response?.data?.error?.message || err.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // login
  const onLogin = async (credentials: Credentials) => {
    setError(null);
    setIsLoading(true);
    logIn(credentials)
      .then(() => readCurrentUser())
      .then((data) => {
        setUser(data);
        // redirect
        navigate(location.state?.from?.pathname || "/");
        enqueueSnackbar("Login Successful", { variant: "success" });
      })
      .catch((err) => {
        setError(err?.response?.data?.error?.message || err.message);
      })
      .finally(() => setIsLoading(false));
  };

  // logout
  const onLogout = async () => {
    setError(null);
    setIsLoading(true);
    logOut()
      .then(() =>
        readCurrentUser()
          .then((data) => setUser(data))
          .catch((err) => {
            if (err?.response?.status === 401) {
              setUser(null);
              // redirect
              navigate("/");
              enqueueSnackbar("Logout Successful", { variant: "success" });
            } else {
              Promise.reject(err);
            }
          })
      )
      .catch((err) => {
        setError(err?.response?.data?.error?.message || err.message);
      })
      .finally(() => setIsLoading(false));
  };

  const value = { user, error, isLoading, onLogin, onLogout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
