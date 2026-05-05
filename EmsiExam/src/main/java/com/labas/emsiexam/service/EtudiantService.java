package com.labas.emsiexam.service;

import com.labas.emsiexam.entity.Etudiant;
import com.labas.emsiexam.repository.EtudiantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EtudiantService {

    private final EtudiantRepository etudiantRepository;

    public EtudiantService(EtudiantRepository etudiantRepository) {
        this.etudiantRepository = etudiantRepository;
    }

    public List<Etudiant> findAll() {
        return etudiantRepository.findAll();
    }

    public Etudiant findById(Long id) {
        return etudiantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etudiant non trouvé avec l'id : " + id));
    }

    public List<Etudiant> findByGroupe(Long groupId) {
        return etudiantRepository.findByGroupId(groupId);
    }

    public List<Etudiant> search(String query) {
        return etudiantRepository.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(query, query);
    }

    public Etudiant save(Etudiant etudiant) {
        return etudiantRepository.save(etudiant);
    }

    public Etudiant update(Long id, Etudiant updated) {
        Etudiant existing = findById(id);
        existing.setPrenom(updated.getPrenom());
        existing.setNom(updated.getNom());
        existing.setEmail(updated.getEmail());
        existing.setGroup(updated.getGroup());
        return etudiantRepository.save(existing);
    }

    public void delete(Long id) {
        findById(id);
        etudiantRepository.deleteById(id);
    }
}
