package com.labas.emsiexam.controller;

import com.labas.emsiexam.entity.Absence;
import com.labas.emsiexam.service.AbsenceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/absences")
@CrossOrigin(origins = "*")
public class AbsenceController {

    private final AbsenceService absenceService;

    public AbsenceController(AbsenceService absenceService) {
        this.absenceService = absenceService;
    }

    @GetMapping
    public ResponseEntity<List<Absence>> getAll() {
        return ResponseEntity.ok(absenceService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Absence> getById(@PathVariable Long id) {
        return ResponseEntity.ok(absenceService.findById(id));
    }

    @GetMapping("/etudiant/{etudiantId}")
    public ResponseEntity<List<Absence>> getByEtudiant(@PathVariable Long etudiantId) {
        return ResponseEntity.ok(absenceService.findByEtudiant(etudiantId));
    }

    @GetMapping("/examen/{examenId}")
    public ResponseEntity<List<Absence>> getByExamen(@PathVariable Long examenId) {
        return ResponseEntity.ok(absenceService.findByExamen(examenId));
    }

    @GetMapping("/justification/{justified}")
    public ResponseEntity<List<Absence>> getByJustification(@PathVariable boolean justified) {
        return ResponseEntity.ok(absenceService.findByJustification(justified));
    }

    @PostMapping
    public ResponseEntity<Absence> create(@RequestBody Absence absence) {
        return ResponseEntity.status(HttpStatus.CREATED).body(absenceService.save(absence));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Absence> update(@PathVariable Long id, @RequestBody Absence absence) {
        return ResponseEntity.ok(absenceService.update(id, absence));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        absenceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
