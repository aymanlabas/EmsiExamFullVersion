package com.labas.emsiexam.repository;

import com.labas.emsiexam.entity.Examen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamenRepository extends JpaRepository<Examen, Long> {

    List<Examen> findByProfesseurId(Long professeurId);

    List<Examen> findByGroupeId(Long groupeId);

    List<Examen> findByTitreContainingIgnoreCase(String titre);
}
