package com.labas.emsiexam.repository;

import com.labas.emsiexam.entity.Soumission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SoumissionRepository extends JpaRepository<Soumission, Long> {

    List<Soumission> findByEtudiantId(Long etudiantId);

    List<Soumission> findByExamenId(Long examenId);
}
