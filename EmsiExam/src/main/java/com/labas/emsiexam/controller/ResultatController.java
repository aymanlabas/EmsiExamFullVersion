package com.labas.emsiexam.controller;

import com.labas.emsiexam.entity.Resultat;
import com.labas.emsiexam.service.ResultatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resultats")
@CrossOrigin(origins = "*")
public class ResultatController {

    private final ResultatService resultatService;

    public ResultatController(ResultatService resultatService) {
        this.resultatService = resultatService;
    }

    @GetMapping
    public ResponseEntity<List<Resultat>> getAll() {
        return ResponseEntity.ok(resultatService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resultat> getById(@PathVariable Long id) {
        return ResponseEntity.ok(resultatService.findById(id));
    }

    @GetMapping("/etudiant/{etudiantId}")
    public ResponseEntity<List<Resultat>> getByEtudiant(@PathVariable Long etudiantId) {
        return ResponseEntity.ok(resultatService.findByEtudiant(etudiantId));
    }

    @GetMapping("/examen/{examenId}")
    public ResponseEntity<List<Resultat>> getByExamen(@PathVariable Long examenId) {
        return ResponseEntity.ok(resultatService.findByExamen(examenId));
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Resultat>> getByStatut(@PathVariable String statut) {
        return ResponseEntity.ok(resultatService.findByStatut(statut));
    }

    @PostMapping
    public ResponseEntity<Resultat> create(@RequestBody Resultat resultat) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resultatService.save(resultat));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resultat> update(@PathVariable Long id, @RequestBody Resultat resultat) {
        return ResponseEntity.ok(resultatService.update(id, resultat));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        resultatService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
