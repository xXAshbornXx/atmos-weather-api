package com.igor.clima_app.controller;

import com.igor.clima_app.service.ClimaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
            // Agora estamos chamando o método com o nome exato que está no seu Service!
            Map<String, Object> dadosClima = climaService.buscarDadosClimaAcesso(cidade);
            return ResponseEntity.ok(dadosClima);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"erro\": \"Cidade não encontrada ou erro interno\"}");
        }
    }
}