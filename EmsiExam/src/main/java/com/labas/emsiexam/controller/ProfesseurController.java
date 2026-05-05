package com.labas.emsiexam.controller;

import com.labas.emsiexam.entity.Professeur;
import com.labas.emsiexam.service.ProfesseurService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professeurs")
@CrossOrigin(origins = "*")
public class ProfesseurController {

    private final ProfesseurService professeurService;

    public ProfesseurController(ProfesseurService professeurService) {
        this.professeurService = professeurService;
    }

    @GetMapping
    public ResponseEntity<List<Professeur>> getAll() {
        return ResponseEntity.ok(professeurService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Professeur> getById(@PathVariable Long id) {
        return ResponseEntity.ok(professeurService.findById(id));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Professeur> getByEmail(@PathVariable String email) {
        return ResponseEntity.ok(professeurService.findByEmail(email));
    }

    @PostMapping
    public ResponseEntity<Professeur> create(@RequestBody Professeur professeur) {
        return ResponseEntity.status(HttpStatus.CREATED).body(professeurService.save(professeur));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Professeur> update(@PathVariable Long id, @RequestBody Professeur professeur) {
        return ResponseEntity.ok(professeurService.update(id, professeur));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        professeurService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
