# ☁️ Atmos - Previsão Inteligente

Atmos é uma aplicação web de sincronização meteorológica em tempo real, focada em entregar uma experiência de usuário (UX) fluida, com respostas visuais instantâneas e dados precisos. 

O projeto foi desenhado para demonstrar habilidades Fullstack, contendo uma interface reativa e um backend estruturado em Java Spring Boot para orquestração de dados.

## 🌟 Funcionalidades e Pontos Fortes

O código foi pensado com foco em resiliência e usabilidade. Os maiores destaques técnicos incluem:

*   **Busca Híbrida Inteligente:** O usuário pode pesquisar o clima por texto (com tratamento automático de URL encoding para cidades com espaços/acentos) ou através da API de Geolocalização nativa do navegador (GPS), utilizando a BigDataCloud API para traduzir coordenadas de volta para o nome da cidade.
*   **UI Dinâmica e Contextual:** O motor de tradução de clima (`traduzirClima()`) analisa os códigos fornecidos pela API e ajusta instantaneamente não apenas o ícone (FontAwesome), mas também os gradientes de fundo da aplicação (Tailwind CSS) para refletir o clima atual (ex: tons fechados para chuva, tons quentes para sol) e se é dia ou noite.
*   **Gestão de Estado e Histórico:** Implementação de `localStorage` para salvar as últimas cidades pesquisadas pelo usuário, criando um histórico em cache (tags clicáveis) que resiste à atualização da página.
*   **Visualização de Tendências:** Integração com **Chart.js** para plotar um gráfico de linha suave e responsivo, demonstrando a tendência de temperatura para as próximas 8 horas.
*   **Feedback Visual e Tratamento de Erros:** Skeletons de carregamento (`skeletonLoad`) previnem o *layout shift* enquanto a API é chamada. Caso ocorra um erro (como cidade não encontrada ou falha de conexão), o sistema captura a exceção de forma amigável e exibe avisos contextuais na tela, sem quebrar o layout.

## 🛠️ Tecnologias Utilizadas

**Frontend (Interface & Lógica Client-side):**
*   **JavaScript (Vanilla):** Requisições assíncronas (`fetch/async/await`), manipulação de DOM e lógica de negócios.
*   **HTML5 & CSS3 (Tailwind CSS):** Estilização utilitária para prototipagem rápida e design responsivo.
*   **Chart.js & FontAwesome:** Renderização de gráficos e iconografia.

**Backend (Arquitetura & Roteamento):**
*   **Java 17+ & Spring Boot:** Criação da API RESTful intermediária.
*   **Spring Web (RestTemplate):** Para consumo e formatação dos dados da API externa (Open-Meteo).
*   **Tratamento de Exceções:** Retorno estruturado de JSONs via `ResponseEntity` para comunicação segura com o frontend.

## 🏗️ Notas sobre a Arquitetura (Serverless vs Backend)

Este repositório possui uma arquitetura híbrida projetada para se adaptar a diferentes ambientes de hospedagem:

1.  **Modo Standalone (GitHub Pages):** Para garantir 100% de disponibilidade online sem estourar limites de IP compartilhado em serviços de nuvem gratuitos, a versão *live* (hospedada no GitHub Pages) faz o consumo direto das APIs de clima pelo próprio navegador (`app.js`).
2.  **Arquitetura Spring Boot:** O código fonte backend (`ClimaController.java` e `ClimaService.java`) foi inteiramente preservado no repositório para fins de demonstração técnica e estudos. Ele é capaz de interceptar, tratar erros de codificação de URL, envelopar dados de geolocalização e repassar para o front de forma segura.

## 🚀 Como Executar o Projeto

### Opção 1: Acesso Rápido (Online)
Basta acessar a página hospedada pelo GitHub Pages:
👉 (https://xxashbornxx.github.io/atmos-weather-api/)

### Opção 2: Rodando Localmente com o Backend Java
Para testar a infraestrutura Fullstack na sua própria máquina:

1. Clone o repositório:
git clone https://github.com/xXAshbornXx/atmos-weather-api.git
   
