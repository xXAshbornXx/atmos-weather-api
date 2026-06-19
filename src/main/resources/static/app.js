function configurarSaudacao() {
    const hora = new Date().getHours();
    let saudacao = 'Boa noite';
    if (hora >= 5 && hora < 12) saudacao = 'Bom dia';
    else if (hora >= 12 && hora < 18) saudacao = 'Boa tarde';
    document.getElementById('textoSaudacao').textContent = `${saudacao}, bem-vindo`;
}
configurarSaudacao();

let historicoCidades = JSON.parse(localStorage.getItem('clima_historico')) || [];
let chartInstancia = null; 

function traduzirClima(codigo, isDay) {
    const mapaClima = {
        0:  { texto: "Céu Limpo", icone: "fa-sun", cor: "text-yellow-400", bg: "from-sky-400 to-indigo-600" },
        1:  { texto: "Principalmente Limpo", icone: "fa-sun", cor: "text-yellow-200", bg: "from-sky-500 to-indigo-700" },
        2:  { texto: "Parcialmente Nublado", icone: "fa-cloud-sun", cor: "text-white", bg: "from-blue-600 to-slate-800" },
        3:  { texto: "Encoberto", icone: "fa-cloud", cor: "text-slate-200", bg: "from-slate-600 to-slate-900" },
        45: { texto: "Neblina", icone: "fa-smog", cor: "text-slate-300", bg: "from-gray-500 to-slate-800" },
        51: { texto: "Garoa Leve", icone: "fa-cloud-rain", cor: "text-blue-200", bg: "from-slate-700 to-slate-900" },
        61: { texto: "Chuva Leve", icone: "fa-cloud-rain", cor: "text-blue-300", bg: "from-slate-800 to-slate-900" },
        63: { texto: "Chuva Moderada", icone: "fa-cloud-showers-heavy", cor: "text-blue-300", bg: "from-slate-800 to-blue-900" },
        65: { texto: "Chuva Forte", icone: "fa-cloud-showers-water", cor: "text-blue-400", bg: "from-gray-900 to-black" },
        80: { texto: "Pancadas de Chuva", icone: "fa-cloud-showers-heavy", cor: "text-blue-300", bg: "from-slate-800 to-gray-900" },
        95: { texto: "Tempestade", icone: "fa-bolt", cor: "text-yellow-400", bg: "from-indigo-950 to-black" }
    };

    const info = mapaClima[codigo] || { 
        texto: "Clima Indefinido", 
        icone: "fa-meteor", 
        cor: "text-white", 
        bg: "from-slate-800 to-slate-900" 
    };
    
    if (isDay === 0 && info.icone.includes('sun')) {
        info.icone = info.icone.replace('sun', 'moon');
        info.cor = "text-indigo-200";
        info.bg = "from-slate-900 via-indigo-950 to-black";
    }
    
    return info;
}

function animarNumero(id, fim, sufixo = '') {
    const obj = document.getElementById(id);
    let start = null;
    const duracao = 800; 
    
    const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duracao, 1);
        obj.innerHTML = Math.floor(progress * fim) + sufixo;
        if (progress < 1) window.requestAnimationFrame(step);
        else obj.innerHTML = fim + sufixo; 
    };
    window.requestAnimationFrame(step);
}

function renderizarGrafico(tempos, temperaturas) {
    const agora = new Date();
    let indexAtual = tempos.findIndex(t => new Date(t) >= agora);
    if (indexAtual === -1) indexAtual = 0;
    
    const labels = tempos.slice(indexAtual, indexAtual + 8).map(t => new Date(t).getHours() + 'h');
    const dadosTemp = temperaturas.slice(indexAtual, indexAtual + 8);

    const ctx = document.getElementById('graficoTendencia').getContext('2d');
    
    if (chartInstancia) chartInstancia.destroy();

    chartInstancia = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: dadosTemp,
                borderColor: 'rgba(165, 180, 252, 1)', 
                backgroundColor: 'rgba(165, 180, 252, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.4, 
                pointRadius: 0, 
                pointHoverRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: true } },
            scales: {
                x: { ticks: { color: 'rgba(255,255,255,0.6)', font: {size: 10} }, grid: { display: false }, border: { display: false } },
                y: { display: false } 
            }
        }
    });
}

function renderizarHistorico() {
    const container = document.getElementById('historicoContainer');
    container.innerHTML = '';
    historicoCidades.forEach(cidade => {
        const tag = document.createElement('button');
        tag.className = 'whitespace-nowrap bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 text-[11px] font-medium py-1.5 px-3 rounded-full transition-all flex items-center gap-2 backdrop-blur-sm';
        tag.innerHTML = `<span>${cidade}</span> <i class="fas fa-times opacity-50 hover:opacity-100 hover:text-red-400 transition" onclick="removerHistorico(event, '${cidade}')"></i>`;
        tag.onclick = (e) => {
            if(e.target.tagName !== 'I') {
                document.getElementById('cidadeInput').value = cidade;
                buscarDados();
            }
        };
        container.appendChild(tag);
    });
}

function adicionarAoHistorico(cidade) {
    if (cidade === "Localização Atual" || cidade === "Localização Encontrada") return;
    historicoCidades = historicoCidades.filter(c => c.toLowerCase() !== cidade.toLowerCase());
    historicoCidades.unshift(cidade);
    if(historicoCidades.length > 3) historicoCidades.pop();
    localStorage.setItem('clima_historico', JSON.stringify(historicoCidades));
    renderizarHistorico();
}

function removerHistorico(event, cidade) {
    event.stopPropagation();
    historicoCidades = historicoCidades.filter(c => c !== cidade);
    localStorage.setItem('clima_historico', JSON.stringify(historicoCidades));
    renderizarHistorico();
}

function alternarTelas(carregando) {
    const emptyState = document.getElementById('emptyState');
    const card = document.getElementById('cardClima');
    const skeleton = document.getElementById('skeletonLoad');
    const msgDiv = document.getElementById('mensagem');

    msgDiv.classList.add('hidden');
    emptyState.classList.add('hidden');
    card.classList.add('hidden', 'scale-95', 'opacity-0');

    if (carregando) skeleton.classList.remove('hidden');
    else skeleton.classList.add('hidden');
}

function exibirMensagem(texto, classeCor) {
    const msgDiv = document.getElementById('mensagem');
    msgDiv.innerHTML = texto;
    msgDiv.className = `text-center text-sm font-medium tracking-wide mb-4 ${classeCor}`;
    msgDiv.classList.remove('hidden');
    document.getElementById('skeletonLoad').classList.add('hidden');
    document.getElementById('emptyState').classList.remove('hidden');
}

function atualizarTela(dados) {
    document.getElementById('skeletonLoad').classList.add('hidden');
    document.getElementById('cardClima').classList.remove('hidden');

    document.getElementById('nomeCidade').textContent = dados.cidade;
    animarNumero('txtTemperatura', Math.round(dados.temperatura));
    
    document.getElementById('txtSensacao').textContent = Math.round(dados.sensacao_termica) + '°';
    document.getElementById('txtUmidade').textContent = dados.umidade + '%';
    document.getElementById('txtVento').textContent = dados.vento + ' km/h';
    document.getElementById('txtPrecipitacao').textContent = (dados.precipitacoes || 0) + ' mm';

    const info = traduzirClima(dados.codigo_clima, dados.is_day);
    document.getElementById('descricaoClima').textContent = info.texto;
    document.getElementById('iconeClima').className = `fas ${info.icone} ${info.cor} text-4xl drop-shadow-lg transition-all`;

    document.getElementById('appBody').className = `bg-gradient-to-tr ${info.bg} min-h-screen flex items-center justify-center p-4 text-white font-sans transition-all duration-1000`;

    const container = document.getElementById('previsao5Dias');
    container.querySelectorAll('.dia-semana').forEach(el => el.remove());
    
    for(let i=1; i<=5; i++) {
        const dia = new Date(dados.daily_time[i]).toLocaleDateString('pt-BR', {weekday: 'short'});
        const min = Math.round(dados.daily_min[i]);
        const max = Math.round(dados.daily_max[i]);
        
        const div = document.createElement('div');
        div.className = 'dia-semana flex items-center justify-between text-xs font-medium';
        div.innerHTML = `
            <span class="w-10 uppercase">${dia}</span>
            <div class="flex-1 mx-4 h-1.5 bg-black/20 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-blue-400 to-yellow-400"></div>
            </div>
            <span class="w-16 text-right">${min}° - ${max}°</span>
        `;
        container.appendChild(div);
    }
    
    if(dados.hourly_time) renderizarGrafico(dados.hourly_time, dados.hourly_temp);

    const card = document.getElementById('cardClima');
    card.classList.remove('hidden');
    setTimeout(() => {
        card.classList.remove('scale-95', 'opacity-0');
        card.classList.add('scale-100', 'opacity-100');
    }, 50);
}

async function buscarDados() {
    const cidadeInput = document.getElementById('cidadeInput');
    const cidade = cidadeInput.value.trim();

    if (!cidade) {
        exibirMensagem('Por favor, informe uma cidade.', 'text-yellow-300');
        return;
    }

    alternarTelas(true);

    try {
        const resposta = await fetch(`https://atmos-weather-api-ugy9.onrender.com/api/clima?cidade=${encodeURIComponent(cidade)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        const dados = await resposta.json();

        if (!resposta.ok) throw new Error(dados.erro || 'Falha na comunicação com a API.');

        adicionarAoHistorico(dados.cidade);
        cidadeInput.value = '';
        atualizarTela(dados);

    } catch (erro) {
        exibirMensagem(`Erro: ${erro.message}`, 'text-red-300 bg-red-900/50 p-2 rounded-lg');
    }
}

function buscarPorGPS() {
    if (!navigator.geolocation) {
        exibirMensagem('Seu navegador não suporta GPS.', 'text-red-300');
        return;
    }

    alternarTelas(true);

    navigator.geolocation.getCurrentPosition(async (position) => {
        try {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            let nomeDescoberto = "Localização Atual";
            try {
                const geoResposta = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`);
                const geoDados = await geoResposta.json();
                nomeDescoberto = geoDados.city || geoDados.locality || "Localização Encontrada";
            } catch (e) {
                console.log("Aviso: Não foi possível traduzir as coordenadas.");
            }

            const resposta = await fetch(`https://atmos-weather-api-ugy9.onrender.com/api/clima/gps?lat=${lat}&lon=${lon}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            const dados = await resposta.json();

            if (!resposta.ok) throw new Error(dados.erro || 'Falha na API.');

            document.getElementById('cidadeInput').value = '';
            
            dados.cidade = nomeDescoberto;
            
            atualizarTela(dados);

        } catch (erro) {
            exibirMensagem(`Erro: ${erro.message}`, 'text-red-300 bg-red-900/50 p-2 rounded-lg');
        }
    }, () => {
        exibirMensagem('Permissão de localização negada.', 'text-yellow-300 bg-yellow-900/50 p-2 rounded-lg');
    });
}

document.getElementById('cidadeInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') buscarDados();
});

renderizarHistorico();