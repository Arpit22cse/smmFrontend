import React, { createContext, useContext, useState } from 'react';
import {useEffect} from 'react'
import { authApi } from '../service/api';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: {
            id: '',
            role: '',
            wallet: 0,
        },
    });
    useEffect(() => {

        authApi.me()
            .then((data) => {
            if (data.data.success) {
                const res = data.data.user;
                setAuth({
                isAuthenticated: true,
                user: {
                    id: res.id,
                    role: res.role,
                    wallet: res.wallet,
                },
                });
            } else {
                setAuth({
                isAuthenticated: false,
                user: { id: '', role: '', wallet: 0 },
                });
            }
            })
            .catch(() => {
            setAuth({
                isAuthenticated: false,
                user: { id: '', role: '', wallet: 0 },
            });
            });
        
    }, []);

    const login = (id, role, wallet) => {
        setAuth({
            isAuthenticated: true,
            user: { id, role, wallet },
        });
    };

    const logout = () => {
        setAuth({
            isAuthenticated: false,
            user: { id: '', role: '', wallet: 0 },
        });
    };

    return (
        <AuthContext.Provider value={{ ...auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);