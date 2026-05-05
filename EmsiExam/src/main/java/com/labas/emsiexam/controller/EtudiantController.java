package com.labas.emsiexam.controller;

import com.labas.emsiexam.entity.Etudiant;
import com.labas.emsiexam.service.EtudiantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etudiants")
@CrossOrigin(origins = "*")
public class EtudiantController {

    private final EtudiantService etudiantService;

    public EtudiantController(EtudiantService etudiantService) {
        this.etudiantService = etudiantService;
    }

    @GetMapping
    public ResponseEntity<List<Etudiant>> getAll() {
        return ResponseEntity.ok(etudiantService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Etudiant> getById(@PathVariable Long id) {
        return ResponseEntity.ok(etudiantService.findById(id));
    }

    @GetMapping("/groupe/{groupId}")
    public ResponseEntity<List<Etudiant>> getByGroupe(@PathVariable Long groupId) {
        return ResponseEntity.ok(etudiantService.findByGroupe(groupId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Etudiant>> search(@RequestParam String q) {
        return ResponseEntity.ok(etudiantService.search(q));
    }

    @PostMapping
    public ResponseEntity<Etudiant> create(@RequestBody Etudiant etudiant) {
        return ResponseEntity.status(HttpStatus.CREATED).body(etudiantService.save(etudiant));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Etudiant> update(@PathVariable Long id, @RequestBody Etudiant etudiant) {
        return ResponseEntity.ok(etudiantService.update(id, etudiant));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        etudiantService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
