package com.labas.emsiexam.repository;

import com.labas.emsiexam.entity.Resultat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultatRepository extends JpaRepository<Resultat, Long> {

    List<Resultat> findByEtudiantId(Long etudiantId);

    List<Resultat> findByExamenId(Long examenId);

    List<Resultat> findByStatut(String statut);
}
