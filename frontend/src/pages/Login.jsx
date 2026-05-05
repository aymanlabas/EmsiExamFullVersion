import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const data = await login({ email, password });
            // Redirect based on role
            switch (data.user.role) {
                case 'ADMIN':
                    navigate('/admin');
                    break;
                case 'PROFESSEUR':
                    navigate('/professeur');
                    break;
                case 'ETUDIANT':
                default:
                    navigate('/exams');
                    break;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Échec de connexion. Vérifiez vos identifiants.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-green-800 mb-6">{t('login.title')}</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Demo credentials hint */}
                <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded mb-4">
                    <p className="font-bold mb-1">Informations de connexion</p>
                    <p><strong>Super Admin :</strong> admin@emsi.ma / admin</p>
                    <p className="mt-2 text-xs italic">
                        * Nouveaux Étudiants & Professeurs (ajoutés par l'admin) ont comme mot de passe par défaut : <strong>emsi</strong>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">{t('login.email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="votre@email.ma"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">{t('login.password')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-700 text-white py-2 rounded font-semibold hover:bg-green-800 transition"
                    >
                        {t('login.submit')}
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    {t('login.no_account')} <Link to="/register" className="text-green-700 hover:underline">{t('login.register_here')}</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
