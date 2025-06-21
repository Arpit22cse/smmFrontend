import React, { createContext, useContext, useState } from 'react';
import {useEffect} from 'react'
import axios from 'axios'


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
    axios.get('/me', { withCredentials: true })
      .then(res => {
        setAuth({
          isAuthenticated: true,
          user:{id:res.userId, role:res.role, wallet:user.wallet}
        });
      })
      .catch(() => {
        setAuth({isAuthenticated: false, user:{id:'',role:'',wallet:0}});
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