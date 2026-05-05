package com.labas.emsiexam.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Resultat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Float note;
    private String statut;

    @ManyToOne
    private Etudiant etudiant;

    @ManyToOne
    private Examen examen;
}
