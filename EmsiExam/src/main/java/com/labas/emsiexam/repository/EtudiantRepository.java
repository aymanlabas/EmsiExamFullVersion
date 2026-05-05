package com.labas.emsiexam.repository;

import com.labas.emsiexam.entity.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {

    List<Etudiant> findByGroupId(Long groupId);

    List<Etudiant> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom);
}
