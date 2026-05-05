package com.labas.emsiexam.service;

import com.labas.emsiexam.entity.Soumission;
import com.labas.emsiexam.repository.SoumissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SoumissionService {

    private final SoumissionRepository soumissionRepository;

    public SoumissionService(SoumissionRepository soumissionRepository) {
        this.soumissionRepository = soumissionRepository;
    }

    public List<Soumission> findAll() {
        return soumissionRepository.findAll();
    }

    public Soumission findById(Long id) {
        return soumissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Soumission non trouvée avec l'id : " + id));
    }

    public List<Soumission> findByEtudiant(Long etudiantId) {
        return soumissionRepository.findByEtudiantId(etudiantId);
    }

    public List<Soumission> findByExamen(Long examenId) {
        return soumissionRepository.findByExamenId(examenId);
    }

    public Soumission save(Soumission soumission) {
        return soumissionRepository.save(soumission);
    }

    public Soumission update(Long id, Soumission updated) {
        Soumission existing = findById(id);
        existing.setReponsePdf(updated.getReponsePdf());
        existing.setDateSoumission(updated.getDateSoumission());
        existing.setNote(updated.getNote());
        existing.setEtudiant(updated.getEtudiant());
        existing.setExamen(updated.getExamen());
        return soumissionRepository.save(existing);
    }

    public void delete(Long id) {
        findById(id);
        soumissionRepository.deleteById(id);
    }
}
