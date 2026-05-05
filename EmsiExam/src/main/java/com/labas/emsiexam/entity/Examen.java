package com.labas.emsiexam.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Examen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private String fichierPdf;

    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;

    private Integer duree; // en minutes

    @ManyToOne
    private Professeur professeur;

    @ManyToOne
    private Groupe groupe;

    @JsonIgnore
    @OneToMany(mappedBy = "examen")
    private List<Soumission> soumissions;
}
