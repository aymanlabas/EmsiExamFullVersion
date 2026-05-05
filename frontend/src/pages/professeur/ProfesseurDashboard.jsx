import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import { getExamensByProfesseur } from '../../services/examenService';
import { getSoumissionsByExamen } from '../../services/soumissionService';

const ProfesseurDashboard = () => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const [examens, setExamens] = useState([]);
    const [stats, setStats] = useState({ totalSoumissions: 0, corrigees: 0 });

    useEffect(() => {
        if (user?.id) {
            fetchData(user.id);
        }
    }, [user]);

    const fetchData = async (profId) => {
        try {
            const fetchedExamens = await getExamensByProfesseur(profId);

            let totalSoum = 0;
            let corr = 0;

            const examensWithStats = await Promise.all(fetchedExamens.map(async (exam) => {
                const soumissions = await getSoumissionsByExamen(exam.id);
                totalSoum += soumissions.length;
                corr += soumissions.filter(s => s.note !== null).length;

                return { ...exam, numSoumissions: soumissions.length };
            }));

            setExamens(examensWithStats);
            setStats({ totalSoumissions: totalSoum, corrigees: corr });
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('navbar.dashboard')} {t('roles.professor')}</h1>
            <p className="text-gray-500 mb-8">Gérez vos examens et consultez les soumissions</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                    <span className="text-3xl">📝</span>
                    <h3 className="text-2xl font-bold text-green-700 mt-2">{examens.length}</h3>
                    <p className="text-gray-500">{t('navbar.my_exams')}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                    <span className="text-3xl">📄</span>
                    <h3 className="text-2xl font-bold text-green-600 mt-2">{stats.totalSoumissions}</h3>
                    <p className="text-gray-500">Soumissions reçues</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                    <span className="text-3xl">✅</span>
                    <h3 className="text-2xl font-bold text-purple-600 mt-2">{stats.corrigees}</h3>
                    <p className="text-gray-500">Corrigées</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">{t('navbar.my_exams')}</h3>
                    {examens.length === 0 ? (
                        <p className="text-gray-500 text-sm italic">Aucun examen trouvé.</p>
                    ) : (
                        examens.map(ex => (
                            <div key={ex.id} className="flex justify-between items-center border-b border-gray-50 py-3">
                                <div>
                                    <p className="font-semibold text-gray-800">{ex.titre}</p>
                                    <p className="text-sm text-gray-500">{ex.duree} min • {ex.numSoumissions} soumissions</p>
                                </div>
                                <Link to="/professeur/notes" className="text-green-700 hover:underline text-sm font-semibold">
                                    Voir notes →
                                </Link>
                            </div>
                        ))
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Actions rapides</h3>
                    <div className="space-y-3">
                        <Link to="/professeur/examens" className="block w-full text-left bg-green-50 hover:bg-green-100 text-green-800 p-3 rounded-lg transition font-semibold">
                            ➕ Créer un nouvel examen
                        </Link>
                        <Link to="/professeur/notes" className="block w-full text-left bg-green-50 hover:bg-green-100 text-green-800 p-3 rounded-lg transition font-semibold">
                            📊 {t('navbar.grades')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfesseurDashboard;
