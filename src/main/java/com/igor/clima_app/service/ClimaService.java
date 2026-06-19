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

    public Map<String, Object> buscarDadosClimaticos(String cidade) throws Exception {
        String urlGeo = urlGeocodingBase + "?name=" + cidade + "&count=1&language=pt";
        Map<String, Object> respostaGeo = restTemplate.getForObject(urlGeo, Map.class);
        
        if (respostaGeo == null || !respostaGeo.containsKey("results")) {
            throw new RuntimeException("Cidade não encontrada.");
        }

        List<Map<String, Object>> resultados = (List<Map<String, Object>>) respostaGeo.get("results");
        Map<String, Object> primeiraCidade = resultados.get(0);
        
        String latitude = primeiraCidade.get("latitude").toString();
        String longitude = primeiraCidade.get("longitude").toString();
        String nomeOficial = primeiraCidade.get("name").toString();

        Map<String, Object> resultadoFinal = buscarDadosPorCoordenadas(latitude, longitude);
        resultadoFinal.put("cidade", nomeOficial); 

        return resultadoFinal;
    }

    public Map<String, Object> buscarDadosPorCoordenadas(String lat, String lon) throws Exception {
    	String urlClima = String.format(
    		    "%s?latitude=%s&longitude=%s&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,is_day&hourly=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=6",
    		    urlForecastBase, lat, lon
    		);
        
        Map<String, Object> respostaClima = restTemplate.getForObject(urlClima, Map.class);
        Map<String, Object> climaAtual = (Map<String, Object>) respostaClima.get("current");
        Map<String, Object> climaPorHora = (Map<String, Object>) respostaClima.get("hourly");

        Map<String, Object> resultadoFinal = new LinkedHashMap<>();
        resultadoFinal.put("cidade", "Localização Atual"); 
        resultadoFinal.put("temperatura", climaAtual.get("temperature_2m"));
        resultadoFinal.put("sensacao_termica", climaAtual.get("apparent_temperature"));
        resultadoFinal.put("umidade", climaAtual.get("relative_humidity_2m"));
        resultadoFinal.put("vento", climaAtual.get("wind_speed_10m"));
        resultadoFinal.put("precipitacao", climaAtual.get("precipitation"));
        resultadoFinal.put("codigo_clima", climaAtual.get("weather_code"));
        
        resultadoFinal.put("is_day", climaAtual.get("is_day"));
        resultadoFinal.put("hourly_time", climaPorHora.get("time"));
        resultadoFinal.put("hourly_temp", climaPorHora.get("temperature_2m"));
        
        Map<String, Object> climaDiario = (Map<String, Object>) respostaClima.get("daily");
        resultadoFinal.put("daily_time", climaDiario.get("time"));
        resultadoFinal.put("daily_max", climaDiario.get("temperature_2m_max"));
        resultadoFinal.put("daily_min", climaDiario.get("temperature_2m_min"));

        return resultadoFinal;
    }
}