package com.labas.emsiexam.service;

import com.labas.emsiexam.entity.Professeur;
import com.labas.emsiexam.repository.ProfesseurRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProfesseurService {

    private final ProfesseurRepository professeurRepository;

    public ProfesseurService(ProfesseurRepository professeurRepository) {
        this.professeurRepository = professeurRepository;
    }

    public List<Professeur> findAll() {
        return professeurRepository.findAll();
    }

    public Professeur findById(Long id) {
        return professeurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professeur non trouvé avec l'id : " + id));
    }

    public Professeur findByEmail(String email) {
        return professeurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Professeur non trouvé avec l'email : " + email));
    }

    public Professeur save(Professeur professeur) {
        return professeurRepository.save(professeur);
    }

    public Professeur update(Long id, Professeur updated) {
        Professeur existing = findById(id);
        existing.setPrenom(updated.getPrenom());
        existing.setNom(updated.getNom());
        existing.setEmail(updated.getEmail());
        return professeurRepository.save(existing);
    }

    public void delete(Long id) {
        findById(id);
        professeurRepository.deleteById(id);
    }
}
