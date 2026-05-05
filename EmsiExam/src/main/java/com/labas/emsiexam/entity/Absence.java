package com.labas.emsiexam.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Absence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private boolean justification;

    @ManyToOne
    private Etudiant etudiant;

    @ManyToOne
    private Examen examen;
}
