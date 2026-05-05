package com.labas.emsiexam.controller;

import com.labas.emsiexam.entity.Groupe;
import com.labas.emsiexam.service.GroupeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groupes")
@CrossOrigin(origins = "*")
public class GroupeController {

    private final GroupeService groupeService;

    public GroupeController(GroupeService groupeService) {
        this.groupeService = groupeService;
    }

    @GetMapping
    public ResponseEntity<List<Groupe>> getAll() {
        return ResponseEntity.ok(groupeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Groupe> getById(@PathVariable Long id) {
        return ResponseEntity.ok(groupeService.findById(id));
    }

    @GetMapping("/professeur/{professeurId}")
    public ResponseEntity<List<Groupe>> getByProfesseur(@PathVariable Long professeurId) {
        return ResponseEntity.ok(groupeService.findByProfesseur(professeurId));
    }

    @PostMapping
    public ResponseEntity<Groupe> create(@RequestBody Groupe groupe) {
        return ResponseEntity.status(HttpStatus.CREATED).body(groupeService.save(groupe));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Groupe> update(@PathVariable Long id, @RequestBody Groupe groupe) {
        return ResponseEntity.ok(groupeService.update(id, groupe));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        groupeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
