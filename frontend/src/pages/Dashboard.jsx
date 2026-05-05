import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { getExamensByGroupe } from '../services/examenService';
import { getAbsencesByEtudiant } from '../services/absenceService';

const Dashboard = () => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const [exams, setExams] = useState([]);
    const [absences, setAbsences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch exams if student belongs to a group
            if (user.group?.id) {
                const fetchedExams = await getExamensByGroupe(user.group.id);
                setExams(fetchedExams);
            }

            // Fetch absences
            if (user.id) {
                const fetchedAbsences = await getAbsencesByEtudiant(user.id);
                setAbsences(fetchedAbsences);
            }

            setLoading(false);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Impossible de charger les données du tableau de bord');
            setLoading(false);
        }
    };

    const getExamStatus = (debut, fin) => {
        const now = new Date();
        if (now < new Date(debut)) return 'upcoming';
        if (now > new Date(fin)) return 'past';
        return 'active';
    };

    if (loading) return <div className="text-center py-20 text-xl">{t('common.loading')}</div>;
    if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

    const activeExams = exams.filter(e => getExamStatus(e.dateDebut, e.dateFin) === 'active');
    const upcomingExams = exams.filter(e => getExamStatus(e.dateDebut, e.dateFin) === 'upcoming');
    const pastExams = exams.filter(e => getExamStatus(e.dateDebut, e.dateFin) === 'past');

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                👋 Bonjour, {user?.prenom} {user?.nom}
            </h1>

            {/* Group and Absence info cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Group card */}
                <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100 flex items-center gap-4">
                    <span className="text-4xl">🏫</span>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Mon Groupe</p>
                        <p className="text-xl font-bold text-gray-800">{user?.group?.nameClass || 'Aucun groupe'}</p>
                        <p className="text-sm text-gray-500">{user?.group ? `ID: ${user.group.id}` : ''}</p>
                    </div>
                </div>

                {/* Absence card */}
                <div className={`bg-white rounded-lg shadow-md p-5 border flex items-center gap-4 ${absences.length > 0 ? 'border-orange-200' : 'border-gray-100'}`}>
                    <span className="text-4xl">📋</span>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Absences</p>
                        <p className={`text-xl font-bold ${absences.length > 0 ? 'text-orange-600' : 'text-gray-800'}`}>
                            {absences.length} absence{absences.length !== 1 ? 's' : ''}
                        </p>
                        {absences.length > 0 && (
                            <p className="text-sm text-orange-500">
                                {absences.filter(a => !a.justification).length} non justifiée(s)
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Active Exams */}
            {activeExams.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500 inline-block animate-pulse"></span>
                        Examens en cours
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeExams.map(exam => (
                            <ExamCard key={exam.id} exam={exam} status="active" t={t} />
                        ))}
                    </div>
                </div>
            )}

            {/* Upcoming Exams */}
            {upcomingExams.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">📅 Examens à venir</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingExams.map(exam => (
                            <ExamCard key={exam.id} exam={exam} status="upcoming" t={t} />
                        ))}
                    </div>
                </div>
            )}

            {/* Past Exams */}
            {pastExams.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">🏁 Examens terminés</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pastExams.map(exam => (
                            <ExamCard key={exam.id} exam={exam} status="past" t={t} />
                        ))}
                    </div>
                </div>
            )}

            {exams.length === 0 && (
                <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
                    {t('dashboard.no_exams')}
                </div>
            )}
        </div>
    );
};

const ExamCard = ({ exam, status, t }) => {
    const statusConfig = {
        active: { badge: 'bg-green-100 text-green-800', label: 'En cours' },
        upcoming: { badge: 'bg-yellow-100 text-yellow-800', label: 'À venir' },
        past: { badge: 'bg-gray-100 text-gray-600', label: 'Terminé' },
    };
    const cfg = statusConfig[status];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border border-gray-100">
            <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-bold text-green-800">{exam.titre}</h2>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${cfg.badge}`}>{cfg.label}</span>
            </div>
            <div className="text-sm text-gray-600 mb-4 space-y-1">
                <p><span className="font-semibold">Durée :</span> {exam.duree} min</p>
                <p><span className="font-semibold">Début :</span> {new Date(exam.dateDebut).toLocaleString()}</p>
                <p><span className="font-semibold">Fin :</span> {new Date(exam.dateFin).toLocaleString()}</p>
                {exam.fichierPdf && (
                    <p className="flex items-center gap-1 text-purple-600">
                        <span>📄</span> {exam.fichierPdf}
                    </p>
                )}
            </div>
            <div className="pt-3 border-t border-gray-100">
                {status === 'active' ? (
                    <Link
                        to={`/exam/${exam.id}`}
                        className="block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition text-center"
                    >
                        {t('dashboard.start_exam')}
                    </Link>
                ) : (
                    <button disabled className="block w-full bg-gray-200 text-gray-500 cursor-not-allowed px-4 py-2 rounded font-semibold">
                        {status === 'past' ? t('dashboard.exam_closed') : t('dashboard.not_yet_open')}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
