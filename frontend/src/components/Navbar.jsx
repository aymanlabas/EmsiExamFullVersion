import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'ADMIN': return t('roles.admin');
            case 'PROFESSEUR': return t('roles.professor');
            case 'ETUDIANT': return t('roles.student');
            default: return role;
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'ADMIN': return 'bg-red-500';
            case 'PROFESSEUR': return 'bg-yellow-500';
            case 'ETUDIANT': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const changeLanguage = (e) => {
        const selectedLang = e.target.value;
        i18n.changeLanguage(selectedLang);
        localStorage.setItem('appLanguage', selectedLang);
    };

    return (
        <nav className="bg-green-700 text-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
                <Link to="/" className="flex items-center">
                    <div className="bg-white rounded-lg px-2 py-1">
                        <img src="/logo.png" alt="EMSI" className="h-10 w-auto object-contain" />
                    </div>
                </Link>

                <div className="flex items-center space-x-4 rtl:space-x-reverse mt-4 sm:mt-0">
                    <select
                        value={i18n.language}
                        onChange={changeLanguage}
                        className="bg-green-800 text-white px-2 py-1 rounded border border-green-600 focus:outline-none text-sm cursor-pointer"
                    >
                        <option value="en">🇬🇧 EN</option>
                        <option value="fr">🇫🇷 FR</option>
                        <option value="ar">🇲🇦 AR</option>
                        <option value="es">🇪🇸 ES</option>
                        <option value="de">🇩🇪 DE</option>
                    </select>

                    {user ? (
                        <>
                            {/* Role-based navigation */}
                            {user.role === 'ADMIN' && (
                                <>
                                    <Link to="/admin" className="hover:text-green-200 transition">{t('navbar.dashboard')}</Link>
                                    <Link to="/admin/etudiants" className="hover:text-green-200 transition">{t('navbar.students')}</Link>
                                    <Link to="/admin/professeurs" className="hover:text-green-200 transition">{t('navbar.professors')}</Link>
                                    <Link to="/admin/examens" className="hover:text-green-200 transition">{t('navbar.exams')}</Link>
                                </>
                            )}
                            {user.role === 'PROFESSEUR' && (
                                <>
                                    <Link to="/professeur" className="hover:text-green-200 transition">{t('navbar.dashboard')}</Link>
                                    <Link to="/professeur/examens" className="hover:text-green-200 transition">{t('navbar.my_exams')}</Link>
                                    <Link to="/professeur/notes" className="hover:text-green-200 transition">{t('navbar.grades')}</Link>
                                </>
                            )}
                            {user.role === 'ETUDIANT' && (
                                <>
                                    {/* <Link to="/exams" className="hover:text-green-200 transition">{t('navbar.exams')}</Link> */}
                                    <Link to="/results" className="hover:text-green-200 transition">{t('navbar.my_results')}</Link>
                                </>
                            )}

                            <div className="flex items-center space-x-2 rtl:space-x-reverse ml-4 rtl:ml-0 rtl:mr-4">
                                <span className={`text-xs px-2 py-1 rounded-full font-bold ${getRoleColor(user.role)}`}>
                                    {getRoleLabel(user.role)}
                                </span>
                                <span className="text-green-200 hidden sm:inline">{user.prenom} {user.nom}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-green-900 hover:bg-green-950 px-4 py-2 rounded transition"
                            >
                                {t('navbar.logout')}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-green-200 transition">{t('navbar.login')}</Link>
                            <Link to="/register" className="bg-white text-green-700 px-4 py-2 rounded font-semibold hover:bg-green-50 transition">
                                {t('navbar.register')}
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
