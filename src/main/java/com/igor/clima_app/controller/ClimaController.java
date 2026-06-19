package com.igor.clima_app.controller;

import com.igor.clima_app.service.ClimaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/clima")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ClimaController {

    @Autowired
    private ClimaService climaService;

    @GetMapping
    public ResponseEntity<?> getClima(@RequestParam String cidade) {
        try {
            Map<String, Object> dadosClima = climaService.buscarDadosClimaAcesso(cidade);
            return ResponseEntity.ok(dadosClima);
        } catch (Exception e) {
            e.printStackTrace();
            // O Java monta o JSON perfeito sozinho, evitando qualquer erro de aspas!
            return ResponseEntity.badRequest().body(Collections.singletonMap("erro", e.getMessage()));
        }
    }
}