import React, { createContext, useContext, useState } from "react";
import { login as loginRequest } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");

        return storedUser
            ? JSON.parse(storedUser)
            : null;
    });

    const login = async (credentials) => {
        const response = await loginRequest(credentials);

        const userData = {
            userId: response.userId,
            name: response.name,
            email: response.email,
            role: response.role,
        };

        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);

        return userData;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}