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
public class Professeur extends Personne {

    @JsonIgnore
    @OneToMany(mappedBy = "professeur")
    private List<Examen> examens;
}