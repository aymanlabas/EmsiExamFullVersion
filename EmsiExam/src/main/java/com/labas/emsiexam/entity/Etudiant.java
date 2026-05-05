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
public class Etudiant extends Personne {

    @ManyToOne
    private Groupe group;

    @JsonIgnore
    @OneToMany(mappedBy = "etudiant")
    private List<Soumission> soumissions;

    @JsonIgnore
    @OneToMany(mappedBy = "etudiant")
    private List<Resultat> resultats;
}