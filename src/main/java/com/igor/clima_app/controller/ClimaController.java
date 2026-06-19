package com.igor.clima_app.controller;

import com.igor.clima_app.service.ClimaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/clima")
@CrossOrigin(origins = "*")
public class ClimaController {

    @Autowired
    private ClimaService climaService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> obterClima(@RequestParam String cidade) throws Exception {
        Map<String, Object> dados = climaService.buscarDadosClimaticos(cidade);
        return ResponseEntity.ok(dados);
    }

    @GetMapping("/gps")
    public ResponseEntity<Map<String, Object>> obterClimaPorGps(@RequestParam String lat, @RequestParam String lon) throws Exception {
        Map<String, Object> dados = climaService.buscarDadosPorCoordenadas(lat, lon);
        return ResponseEntity.ok(dados);
    }
}