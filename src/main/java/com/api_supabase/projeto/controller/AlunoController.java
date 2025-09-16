package com.api_supabase.projeto.controller;

import com.api_supabase.projeto.models.Aluno;
import com.api_supabase.projeto.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/api/alunos")
@CrossOrigin(origins = "*")
public class AlunoController {

    @Autowired
    private AlunoRepository alunoRepository;

    @PostMapping("/cadastrar")
    public ResponseEntity<Aluno> cadastrar(@RequestBody Aluno aluno) {
        if (aluno.getNome() == null || aluno.getNome().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Aluno alunoSalvo = alunoRepository.save(aluno);
        return ResponseEntity.ok(alunoSalvo);
    }

    @GetMapping("/listar")
    public List<Aluno> listar() {
        return StreamSupport.stream(alunoRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Aluno> buscarPorId(@PathVariable Long id) {
        return alunoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<Aluno> atualizar(@RequestBody Aluno dadosAtualizados) {
        return alunoRepository.findById(dadosAtualizados.getId())
                .map(aluno -> {
                    aluno.setNome(dadosAtualizados.getNome());
                    aluno.setSerie(dadosAtualizados.getSerie());
                    aluno.setSexo(dadosAtualizados.getSexo());

                    Aluno alunoSalvo = alunoRepository.save(aluno);
                    return ResponseEntity.ok(alunoSalvo);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (!alunoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        alunoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}