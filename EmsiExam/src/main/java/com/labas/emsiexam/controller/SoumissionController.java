package com.labas.emsiexam.controller;

import com.labas.emsiexam.entity.Soumission;
import com.labas.emsiexam.service.SoumissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/soumissions")
@CrossOrigin(origins = "*")
public class SoumissionController {

    private final SoumissionService soumissionService;

    public SoumissionController(SoumissionService soumissionService) {
        this.soumissionService = soumissionService;
    }

    @GetMapping
    public ResponseEntity<List<Soumission>> getAll() {
        return ResponseEntity.ok(soumissionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Soumission> getById(@PathVariable Long id) {
        return ResponseEntity.ok(soumissionService.findById(id));
    }

    @GetMapping("/etudiant/{etudiantId}")
    public ResponseEntity<List<Soumission>> getByEtudiant(@PathVariable Long etudiantId) {
        return ResponseEntity.ok(soumissionService.findByEtudiant(etudiantId));
    }

    @GetMapping("/examen/{examenId}")
    public ResponseEntity<List<Soumission>> getByExamen(@PathVariable Long examenId) {
        return ResponseEntity.ok(soumissionService.findByExamen(examenId));
    }

    @PostMapping
    public ResponseEntity<Soumission> create(@RequestBody Soumission soumission) {
        return ResponseEntity.status(HttpStatus.CREATED).body(soumissionService.save(soumission));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Soumission> update(@PathVariable Long id, @RequestBody Soumission soumission) {
        return ResponseEntity.ok(soumissionService.update(id, soumission));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        soumissionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
