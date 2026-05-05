import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            // Hardcoded super admin
            if (credentials.email === 'admin@emsi.ma' && credentials.password === 'admin') {
                const adminUser = { id: 0, prenom: 'Admin', nom: 'System', email: 'admin@emsi.ma', role: 'ADMIN' };
                localStorage.setItem('token', 'fake-admin-token');
                localStorage.setItem('user', JSON.stringify(adminUser));
                setUser(adminUser);
                return { user: adminUser };
            }

            // 1. Try to fetch students
            const { data: etudiants } = await api.get('/etudiants');
            const foundEtudiant = etudiants.find(e => e.email === credentials.email);

            if (foundEtudiant && (foundEtudiant.password || 'emsi') === credentials.password) {
                const authUser = { ...foundEtudiant, role: 'ETUDIANT' };
                delete authUser.password;
                localStorage.setItem('token', `fake-etudiant-token-${authUser.id}`);
                localStorage.setItem('user', JSON.stringify(authUser));
                setUser(authUser);
                return { user: authUser };
            }

            // 2. Try to fetch professors
            const { data: professeurs } = await api.get('/professeurs');
            const foundProf = professeurs.find(p => p.email === credentials.email);

            if (foundProf && (foundProf.password || 'emsi') === credentials.password) {
                const authUser = { ...foundProf, role: 'PROFESSEUR' };
                delete authUser.password;
                localStorage.setItem('token', `fake-prof-token-${authUser.id}`);
                localStorage.setItem('user', JSON.stringify(authUser));
                setUser(authUser);
                return { user: authUser };
            }

            // If we reach here, invalid credentials
            throw new Error('Email ou mot de passe incorrect.');

        } catch (error) {
            console.error("Login error:", error);
            throw { response: { data: { message: error.message || 'Échec de la connexion au serveur.' } } };
        }
    };

    const register = async (userData) => {
        return { message: 'Inscription via administrateur uniquement.' };
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
