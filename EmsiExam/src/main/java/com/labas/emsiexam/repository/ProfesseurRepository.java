package com.labas.emsiexam.repository;

import com.labas.emsiexam.entity.Professeur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfesseurRepository extends JpaRepository<Professeur, Long> {

    Optional<Professeur> findByEmail(String email);
}
