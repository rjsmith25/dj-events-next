import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { NEXT_URL } from "@/config/index";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Register user
  const register = async (user) => {
    try {
      const res = await axios.post(`${NEXT_URL}/api/register`, user);

      setUser(res.data);
      router.push("/account/dashboard");
    } catch (e) {
      setError(e.response.data.message);
      setError(null);
    }
  };

  // Login user
  const login = async ({ email: identifier, password }) => {
    try {
      const res = await axios.post(`${NEXT_URL}/api/login`, {
        identifier: identifier,
        password: password,
      });

      setUser(res.data);
      router.push("/account/dashboard");
    } catch (e) {
      setError(e.response.data.message);
      setError(null);
    }
  };

  //Logout user
  const logout = async () => {
    const res = await axios.post(`${NEXT_URL}/api/logout`);
    setUser(null);
    router.push("/");
  };

  // check if user is logged in
  const checkUserLoggedIn = async (user) => {
    try {
      const res = await axios.get(`${NEXT_URL}/api/user`);
      setUser(res.data);
    } catch (e) {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
