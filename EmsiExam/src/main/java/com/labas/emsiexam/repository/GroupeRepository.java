package com.labas.emsiexam.repository;

import com.labas.emsiexam.entity.Groupe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupeRepository extends JpaRepository<Groupe, Long> {

    List<Groupe> findByProfesseurId(Long professeurId);
}
