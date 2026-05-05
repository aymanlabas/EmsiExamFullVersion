import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getEtudiants } from '../../services/etudiantService';
import { getProfesseurs } from '../../services/professeurService';
import { getExamens } from '../../services/examenService';
import { getSoumissions } from '../../services/soumissionService';
import { getGroupes } from '../../services/groupService';
import { getAbsences } from '../../services/absenceService';

const AdminDashboard = () => {
    const { t } = useTranslation();

    const [counts, setCounts] = useState({
        etudiants: 0,
        professeurs: 0,
        examens: 0,
        soumissions: 0,
        groupes: 0,
        absences: 0
    });

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch all data
                const [
                    etudiants, professeurs, examens,
                    soumissions, groupes, absences
                ] = await Promise.all([
                    getEtudiants(), getProfesseurs(), getExamens(),
                    getSoumissions(), getGroupes(), getAbsences()
                ]);

                // Set lengths for the counters
                setCounts({
                    etudiants: etudiants.length,
                    professeurs: professeurs.length,
                    examens: examens.length,
                    soumissions: soumissions.length,
                    groupes: groupes.length,
                    absences: absences.length,
                });

                // Generate dynamic "Recent Activity" based on the highest IDs / newest items
                const recent = [];

                if (soumissions.length > 0) {
                    const latestSoum = soumissions[soumissions.length - 1]; // Assuming appended sequentially
                    const etudName = latestSoum.etudiant ? `${latestSoum.etudiant.prenom} ${latestSoum.etudiant.nom}` : "Un étudiant";
                    const examName = latestSoum.examen && latestSoum.examen.titre ? latestSoum.examen.titre : "un examen";
                    recent.push({ id: `s-${latestSoum.id}`, text: `${etudName} a soumis "${examName}"`, time: "récemment" });
                }

                if (examens.length > 0) {
                    const latestExam = examens[examens.length - 1];
                    const profName = latestExam.professeur ? latestExam.professeur.nom : "Un professeur";
                    recent.push({ id: `ex-${latestExam.id}`, text: `Prof. ${profName} a créé l'examen "${latestExam.titre}"`, time: "récemment" });
                }

                if (etudiants.length > 0) {
                    const latestEtud = etudiants[etudiants.length - 1];
                    recent.push({ id: `et-${latestEtud.id}`, text: `Nouvel étudiant inscrit : ${latestEtud.prenom} ${latestEtud.nom}`, time: "récemment" });
                }

                if (absences.length > 0) {
                    const latestAbs = absences[absences.length - 1];
                    const etudName = latestAbs.etudiant ? `${latestAbs.etudiant.prenom} ${latestAbs.etudiant.nom}` : "Un étudiant";
                    const examName = latestAbs.examen ? latestAbs.examen.titre : "";
                    recent.push({ id: `a-${latestAbs.id}`, text: `Absence enregistrée : ${etudName} - ${examName}`, time: "récemment" });
                }

                if (groupes.length > 0) {
                    const latestGrp = groupes[groupes.length - 1];
                    recent.push({ id: `g-${latestGrp.id}`, text: `Groupe ${latestGrp.nameClass} créé`, time: "récemment" });
                }

                // If no data, provide fallback
                if (recent.length === 0) {
                    recent.push({ id: 'none', text: "Aucune activité récente", time: "" });
                }

                setActivities(recent.reverse());

            } catch (error) {
                console.error("Erreur de chargement du dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statsConfig = [
        { label: t('navbar.students'), count: counts.etudiants, icon: '🎓', color: 'bg-green-500', link: '/admin/etudiants' },
        { label: t('navbar.professors'), count: counts.professeurs, icon: '👨‍🏫', color: 'bg-yellow-500', link: '/admin/professeurs' },
        { label: t('navbar.exams'), count: counts.examens, icon: '📝', color: 'bg-green-600', link: '/admin/examens' },
        { label: 'Soumissions', count: counts.soumissions, icon: '📄', color: 'bg-purple-500', link: '/admin/soumissions' },
        { label: 'Groupes', count: counts.groupes, icon: '🏫', color: 'bg-blue-500', link: '/admin/groupes' },
        { label: 'Absences', count: counts.absences, icon: '📋', color: 'bg-orange-500', link: '/admin/absences' },
    ];

    if (loading) {
        return <div className="p-10 text-center text-gray-500 font-bold text-xl">⏳ Chargement de votre tableau de bord...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('navbar.dashboard')} Admin</h1>
            <p className="text-gray-500 mb-8">Gestion des utilisateurs, examens, groupes et absences</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {statsConfig.map((s) => (
                    <Link to={s.link} key={s.label} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border border-gray-100 group">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl">{s.icon}</span>
                            <span className={`${s.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>{s.count}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-green-700 transition">{s.label}</h3>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Actions rapides</h3>
                    <div className="space-y-3">
                        <Link to="/admin/etudiants" className="block w-full text-left bg-green-50 hover:bg-green-100 text-green-800 p-3 rounded-lg transition font-semibold">
                            ➕ {t('common.add')} {t('navbar.students')}
                        </Link>
                        <Link to="/admin/professeurs" className="block w-full text-left bg-yellow-50 hover:bg-yellow-100 text-yellow-800 p-3 rounded-lg transition font-semibold">
                            ➕ {t('common.add')} {t('navbar.professors')}
                        </Link>
                        <Link to="/admin/examens" className="block w-full text-left bg-green-50 hover:bg-green-100 text-green-800 p-3 rounded-lg transition font-semibold">
                            ➕ Créer un examen
                        </Link>
                        <Link to="/admin/groupes" className="block w-full text-left bg-blue-50 hover:bg-blue-100 text-blue-800 p-3 rounded-lg transition font-semibold">
                            🏫 Gérer les groupes
                        </Link>
                        <Link to="/admin/absences" className="block w-full text-left bg-orange-50 hover:bg-orange-100 text-orange-800 p-3 rounded-lg transition font-semibold">
                            📋 Gérer les absences
                        </Link>
                        <Link to="/admin/soumissions" className="block w-full text-left bg-purple-50 hover:bg-purple-100 text-purple-800 p-3 rounded-lg transition font-semibold">
                            📄 Voir les soumissions
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Activité récente</h3>
                    <div className="space-y-3 text-sm text-gray-600">
                        {activities.map((act, idx) => (
                            <div key={act.id || idx} className="flex justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                <span>{act.text}</span>
                                <span className="text-gray-400 text-xs mt-1">{act.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
