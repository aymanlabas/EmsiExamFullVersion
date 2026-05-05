package com.labas.emsiexam.service;

import com.labas.emsiexam.entity.Examen;
import com.labas.emsiexam.repository.ExamenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ExamenService {

    private final ExamenRepository examenRepository;

    public ExamenService(ExamenRepository examenRepository) {
        this.examenRepository = examenRepository;
    }

    public List<Examen> findAll() {
        return examenRepository.findAll();
    }

    public Examen findById(Long id) {
        return examenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Examen non trouvé avec l'id : " + id));
    }

    public List<Examen> findByProfesseur(Long professeurId) {
        return examenRepository.findByProfesseurId(professeurId);
    }

    public List<Examen> findByGroupe(Long groupeId) {
        return examenRepository.findByGroupeId(groupeId);
    }

    public List<Examen> searchByTitre(String titre) {
        return examenRepository.findByTitreContainingIgnoreCase(titre);
    }

    public Examen save(Examen examen) {
        return examenRepository.save(examen);
    }

    public Examen update(Long id, Examen updated) {
        Examen existing = findById(id);
        existing.setTitre(updated.getTitre());
        existing.setFichierPdf(updated.getFichierPdf());
        existing.setDateDebut(updated.getDateDebut());
        existing.setDateFin(updated.getDateFin());
        existing.setDuree(updated.getDuree());
        existing.setProfesseur(updated.getProfesseur());
        existing.setGroupe(updated.getGroupe());
        return examenRepository.save(existing);
    }

    public void delete(Long id) {
        findById(id); // throws if not found
        examenRepository.deleteById(id);
    }
}
