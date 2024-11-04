import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null);

    const login = (id_rol) => {
        console.log("Login con rol:", id_rol); // Debugging
        setUserRole(id_rol);
    };

    const logout = () => {
        console.log("Logout"); // Debugging
        setUserRole(null);
    };

    return (
        <AuthContext.Provider value={{ userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
