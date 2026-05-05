package com.labas.emsiexam.service;

import com.labas.emsiexam.entity.Groupe;
import com.labas.emsiexam.repository.GroupeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class GroupeService {

    private final GroupeRepository groupeRepository;

    public GroupeService(GroupeRepository groupeRepository) {
        this.groupeRepository = groupeRepository;
    }

    public List<Groupe> findAll() {
        return groupeRepository.findAll();
    }

    public Groupe findById(Long id) {
        return groupeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé avec l'id : " + id));
    }

    public List<Groupe> findByProfesseur(Long professeurId) {
        return groupeRepository.findByProfesseurId(professeurId);
    }

    public Groupe save(Groupe groupe) {
        return groupeRepository.save(groupe);
    }

    public Groupe update(Long id, Groupe updated) {
        Groupe existing = findById(id);
        existing.setNameClass(updated.getNameClass());
        existing.setProfesseur(updated.getProfesseur());
        return groupeRepository.save(existing);
    }

    public void delete(Long id) {
        findById(id);
        groupeRepository.deleteById(id);
    }
}
