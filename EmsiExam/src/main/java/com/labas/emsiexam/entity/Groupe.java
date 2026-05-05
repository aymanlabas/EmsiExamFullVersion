package com.labas.emsiexam.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Groupe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nameClass;

    @ManyToOne
    private Professeur professeur;

    @JsonIgnore
    @OneToMany(mappedBy = "group")
    private List<Etudiant> etudiants;

    @PreRemove
    private void preRemove() {
        if (etudiants != null) {
            for (Etudiant etudiant : etudiants) {
                etudiant.setGroup(null);
            }
        }
    }
}