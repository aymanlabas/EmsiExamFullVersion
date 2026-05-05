package com.labas.emsiexam.service;

import com.labas.emsiexam.entity.Resultat;
import com.labas.emsiexam.repository.ResultatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ResultatService {

    private final ResultatRepository resultatRepository;

    public ResultatService(ResultatRepository resultatRepository) {
        this.resultatRepository = resultatRepository;
    }

    public List<Resultat> findAll() {
        return resultatRepository.findAll();
    }

    public Resultat findById(Long id) {
        return resultatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resultat non trouvé avec l'id : " + id));
    }

    public List<Resultat> findByEtudiant(Long etudiantId) {
        return resultatRepository.findByEtudiantId(etudiantId);
    }

    public List<Resultat> findByExamen(Long examenId) {
        return resultatRepository.findByExamenId(examenId);
    }

    public List<Resultat> findByStatut(String statut) {
        return resultatRepository.findByStatut(statut);
    }

    public Resultat save(Resultat resultat) {
        return resultatRepository.save(resultat);
    }

    public Resultat update(Long id, Resultat updated) {
        Resultat existing = findById(id);
        existing.setNote(updated.getNote());
        existing.setStatut(updated.getStatut());
        existing.setEtudiant(updated.getEtudiant());
        existing.setExamen(updated.getExamen());
        return resultatRepository.save(existing);
    }

    public void delete(Long id) {
        findById(id);
        resultatRepository.deleteById(id);
    }
}
