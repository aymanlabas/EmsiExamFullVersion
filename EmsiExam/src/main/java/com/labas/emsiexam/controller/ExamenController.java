package com.labas.emsiexam.controller;

import com.labas.emsiexam.entity.Examen;
import com.labas.emsiexam.service.ExamenService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/examens")
@CrossOrigin(origins = "*")
public class ExamenController {

    private final ExamenService examenService;

    public ExamenController(ExamenService examenService) {
        this.examenService = examenService;
    }

    @GetMapping
    public ResponseEntity<List<Examen>> getAll() {
        return ResponseEntity.ok(examenService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Examen> getById(@PathVariable Long id) {
        return ResponseEntity.ok(examenService.findById(id));
    }

    @GetMapping("/professeur/{professeurId}")
    public ResponseEntity<List<Examen>> getByProfesseur(@PathVariable Long professeurId) {
        return ResponseEntity.ok(examenService.findByProfesseur(professeurId));
    }

    @GetMapping("/groupe/{groupeId}")
    public ResponseEntity<List<Examen>> getByGroupe(@PathVariable Long groupeId) {
        return ResponseEntity.ok(examenService.findByGroupe(groupeId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Examen>> search(@RequestParam String titre) {
        return ResponseEntity.ok(examenService.searchByTitre(titre));
    }

    @PostMapping
    public ResponseEntity<Examen> create(@RequestBody Examen examen) {
        return ResponseEntity.status(HttpStatus.CREATED).body(examenService.save(examen));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Examen> update(@PathVariable Long id, @RequestBody Examen examen) {
        return ResponseEntity.ok(examenService.update(id, examen));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        examenService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
