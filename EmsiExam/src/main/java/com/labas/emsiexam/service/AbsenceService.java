package com.labas.emsiexam.service;

import com.labas.emsiexam.entity.Absence;
import com.labas.emsiexam.repository.AbsenceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AbsenceService {

    private final AbsenceRepository absenceRepository;

    public AbsenceService(AbsenceRepository absenceRepository) {
        this.absenceRepository = absenceRepository;
    }

    public List<Absence> findAll() {
        return absenceRepository.findAll();
    }

    public Absence findById(Long id) {
        return absenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Absence non trouvée avec l'id : " + id));
    }

    public List<Absence> findByEtudiant(Long etudiantId) {
        return absenceRepository.findByEtudiantId(etudiantId);
    }

    public List<Absence> findByExamen(Long examenId) {
        return absenceRepository.findByExamenId(examenId);
    }

    public List<Absence> findByJustification(boolean justification) {
        return absenceRepository.findByJustification(justification);
    }

    public Absence save(Absence absence) {
        return absenceRepository.save(absence);
    }

    public Absence update(Long id, Absence updated) {
        Absence existing = findById(id);
        existing.setDate(updated.getDate());
        existing.setJustification(updated.isJustification());
        existing.setEtudiant(updated.getEtudiant());
        existing.setExamen(updated.getExamen());
        return absenceRepository.save(existing);
    }

    public void delete(Long id) {
        findById(id);
        absenceRepository.deleteById(id);
    }
}
