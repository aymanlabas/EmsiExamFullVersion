package com.labas.emsiexam.entity;

import jakarta.persistence.*;
import lombok.*;

@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class Personne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    protected String prenom;
    protected String nom;
    protected String email;
    protected String password = "emsi"; // Default password
}