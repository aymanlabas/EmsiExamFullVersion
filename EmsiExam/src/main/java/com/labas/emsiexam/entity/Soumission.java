package com.labas.emsiexam.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Soumission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reponsePdf;
    private LocalDateTime dateSoumission;
    private Float note;

    @ManyToOne
    private Etudiant etudiant;

    @ManyToOne
    private Examen examen;
}