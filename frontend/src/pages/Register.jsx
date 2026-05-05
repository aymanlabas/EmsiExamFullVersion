import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await register({ name, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-green-800 mb-6">{t('register.title')}</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">{t('register.full_name')}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">{t('register.email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">{t('register.password')}</label>
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
                        {t('register.submit')}
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    {t('register.has_account')} <Link to="/login" className="text-green-700 hover:underline">{t('register.login_here')}</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
