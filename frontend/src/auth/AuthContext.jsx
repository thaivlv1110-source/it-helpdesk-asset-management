import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser =
      localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const [loading, setLoading] =
    useState(true);

  const login = async ({
    email,
    password,
  }) => {
    const response =
      await axiosClient.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

    const {
      token,
      user: loggedInUser,
    } = response.data.data;

    localStorage.setItem(
      "accessToken",
      token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);

    return loggedInUser;
  };

  const logout = () => {
    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem(
      "user"
    );

    setUser(null);
  };

  useEffect(() => {
    const verifyUser = async () => {
      const token =
        localStorage.getItem(
          "accessToken"
        );

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response =
          await axiosClient.get(
            "/auth/me"
          );

        const currentUser =
          response.data.data;

        setUser(currentUser);

        localStorage.setItem(
          "user",
          JSON.stringify(currentUser)
        );
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};