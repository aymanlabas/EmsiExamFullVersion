package com.labas.emsiexam.repository;

import com.labas.emsiexam.entity.Absence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AbsenceRepository extends JpaRepository<Absence, Long> {

    List<Absence> findByEtudiantId(Long etudiantId);

    List<Absence> findByExamenId(Long examenId);

    List<Absence> findByJustification(boolean justification);
}
