import { useState } from "react";

const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const setAuth = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return {
    isAuth: Boolean(token),
    setAuth,
    logout,
  };
};

export default useAuth;
