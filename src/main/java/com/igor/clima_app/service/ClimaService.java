package com.igor.clima_app.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ClimaService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${api.clima.geocoding.url}")
    private String urlGeocodingBase;

    @Value("${api.clima.forecast.url}")
    private String urlForecastBase;

    public Map<String, Object> buscarDadosClimaAcesso(String cidade) throws Exception {
        String urlGeo = urlGeocodingBase + "?name=" + cidade + "&count=1&language=pt";
        
        @SuppressWarnings("unchecked")
        Map<String, Object> respostaGeo = restTemplate.getForObject(urlGeo, Map.class);

       if (respostaGeo == null || !respostaGeo.containsKey("results")) {
            throw new RuntimeException("Cidade não encontrada.");
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> resultados = (List<Map<String, Object>>) respostaGeo.get("results");
        
        if (resultados == null || resultados.isEmpty()) {
            throw new RuntimeException("Cidade não encontrada.");
        }

        Map<String, Object> primeiraCidade = resultados.get(0);

        String latitude = String.valueOf(primeiraCidade.get("latitude"));
        String longitude = String.valueOf(primeiraCidade.get("longitude"));
        String nomeOficial = String.valueOf(primeiraCidade.get("name"));

        Map<String, Object> resultadoFinal = buscarDadosPorCoordenadas(latitude, longitude);
        resultadoFinal.put("cidade", nomeOficial);

        return resultadoFinal;
    }

    public Map<String, Object> buscarDadosPorCoordenadas(String lat, String lon) throws Exception {
        String urlClima = urlForecastBase + "?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,is_day&hourly=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America%2FSao_Paulo";

        @SuppressWarnings("unchecked")
        Map<String, Object> respostaClima = restTemplate.getForObject(urlClima, Map.class);

        if (respostaClima == null) {
            throw new RuntimeException("Erro ao buscar dados do clima.");
        }

        Map<String, Object> resultadoFinal = new LinkedHashMap<>();
        
       @SuppressWarnings("unchecked")
        Map<String, Object> climaAtual = (Map<String, Object>) respostaClima.get("current");
        
        if (climaAtual != null) {
            resultadoFinal.put("temperatura", climaAtual.get("temperature_2m"));
            resultadoFinal.put("sensacao_termica", climaAtual.get("apparent_temperature"));
            resultadoFinal.put("umidade", climaAtual.get("relative_humidity_2m"));
            resultadoFinal.put("vento", climaAtual.get("wind_speed_10m"));
            resultadoFinal.put("precipitacao", climaAtual.get("precipitation"));
            resultadoFinal.put("codigo_clima", climaAtual.get("weather_code"));
            resultadoFinal.put("is_day", climaAtual.get("is_day"));
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> climaDiario = (Map<String, Object>) respostaClima.get("daily");
        if (climaDiario != null) {
           resultadoFinal.put("daily_time", climaDiario.get("time"));
           resultadoFinal.put("daily_max", climaDiario.get("temperature_2m_max"));
           resultadoFinal.put("daily_min", climaDiario.get("temperature_2m_min"));
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> climaHorario = (Map<String, Object>) respostaClima.get("hourly");
        if (climaHorario != null) {
            resultadoFinal.put("hourly_time", climaHorario.get("time"));
            resultadoFinal.put("hourly_temp", climaHorario.get("temperature_2m"));
        }

        return resultadoFinal;
    }
}