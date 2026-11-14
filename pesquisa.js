const barra = document.getElementById("barraPesquisa");
const filtros = document.querySelectorAll(".filtro-btn");

let filtroAtual = "todos";
let termoPesquisa = "";

const urlParams = new URLSearchParams(window.location.search);
const termoDaURL = urlParams.get('busca');
if (termoDaURL) {
    barra.value = termoDaURL;
    termoPesquisa = termoDaURL.toLowerCase();
}

filtros.forEach(filtro => {
    filtro.addEventListener("click", () => {
        filtros.forEach(f => f.classList.remove("ativo"));
        filtro.classList.add("ativo");
        filtroAtual = filtro.dataset.categoria;
        aplicarFiltros();
    });
});

barra.addEventListener("input", () => {
    termoPesquisa = barra.value.toLowerCase();
    aplicarFiltros();
});

function aplicarFiltros() {
    document.querySelectorAll(".card").forEach(card => {
        const nome = card.dataset.nome.toLowerCase();
        const categorias = card.dataset.categoria.split(',');
        const correspondeCategoria = filtroAtual === "todos" || categorias.includes(filtroAtual);
        const correspondePesquisa = nome.includes(termoPesquisa);
        card.style.display = (correspondeCategoria && correspondePesquisa) ? "flex" : "none";
    });
}

const TOLEDO_LAT = -24.7244;
const TOLEDO_LNG = -53.7449;

const mapa = L.map('mapa-pins').setView([TOLEDO_LAT, TOLEDO_LNG], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(mapa);

function configurarCard(card) {
    const lat = parseFloat(card.dataset.lat);
    const lng = parseFloat(card.dataset.lng);
    const nome = card.dataset.nome;

    if (!lat || !lng) return;

    const marcador = L.marker([lat, lng])
        .addTo(mapa)
        .bindPopup(`<strong>${nome}</strong>`);

    const btn = card.querySelector('.btn-ver-mapa');
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            mapa.setView([lat, lng], 17);
            marcador.openPopup();
            document.getElementById('mapa-pins').scrollIntoView({ behavior: 'smooth' });
        });
    }

    card.addEventListener("click", () => {
        if (card.dataset.pagina) {
            window.location.href = card.dataset.pagina;
        }
    });
}

document.querySelectorAll('.card').forEach(configurarCard);
aplicarFiltros();

const tipoParaCategoria = {
    'restaurant':    'restaurante',
    'bar':           'bar',
    'cafe':          'cafe',
    'pub':           'bar',
    'ice_cream':     'sorveteria',
    'fast_food':     'restaurante',
    'attraction':    'cultural',
    'museum':        'cultural',
    'aquarium':      'cultural',
    'theatre':       'cultural',
    'gallery':       'cultural',
    'winery':        'cultural',
    'memorial':      'cultural',
    'monument':      'cultural',
    'park':          'parque',
    'water_park':    'parque',
    'zoo':           'parque',
    'hotel':         'cultural',
    'sports_centre': 'esporte',
    'stadium':       'esporte',
    'pitch':         'esporte',
    'track':         'esporte',
};

const tipoParaLabel = {
    'restaurant':    'Restaurante',
    'bar':           'Bar',
    'cafe':          'Café',
    'pub':           'Pub',
    'ice_cream':     'Sorveteria',
    'fast_food':     'Restaurante',
    'attraction':    'Atração',
    'museum':        'Museu',
    'aquarium':      'Aquário',
    'theatre':       'Teatro',
    'gallery':       'Galeria',
    'winery':        'Vinícola',
    'memorial':      'Memorial',
    'monument':      'Monumento',
    'park':          'Parque',
    'water_park':    'Parque Aquático',
    'zoo':           'Zoológico',
    'hotel':         'Hotel',
    'sports_centre': 'Centro Esportivo',
    'stadium':       'Estádio',
    'pitch':         'Campo Esportivo',
    'track':         'Pista',
};

const nomesCadastrados = new Set(
    Array.from(document.querySelectorAll('.card'))
        .map(c => c.dataset.nome.toLowerCase().trim())
);

const servidoresOSM = [
    "https://overpass-api.de/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter"
];

async function buscarOSM(query) {
    const controladores = servidoresOSM.map(() => new AbortController());
    const requisicoes = servidoresOSM.map((servidor, indice) => {
        const timeout = setTimeout(() => controladores[indice].abort(), 30000);

        return fetch(`${servidor}?data=${encodeURIComponent(query)}`, {
            signal: controladores[indice].signal
        })
            .then(resposta => {
                if (!resposta.ok) throw new Error(`Servidor respondeu ${resposta.status}`);
                return resposta.json();
            })
            .finally(() => clearTimeout(timeout));
    });

    try {
        return await Promise.any(requisicoes);
    } finally {
        controladores.forEach(controlador => controlador.abort());
    }
}

async function buscarLocaisOSM() {
    const CACHE_KEY = 'tolemaps_osm_cache';
    const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas

    const cacheAtual = localStorage.getItem(CACHE_KEY);
    if (cacheAtual) {
        try {
            const { timestamp, dados } = JSON.parse(cacheAtual);
            if (Date.now() - timestamp < CACHE_TTL) {
                dados.forEach(local => criarCardOSM(local));
                aplicarFiltros();
                return;
            }
        } catch (e) {
            localStorage.removeItem(CACHE_KEY);
        }
    }

    const query = `
        [out:json][timeout:25];
        (
            node["amenity"~"restaurant|bar|cafe|pub|ice_cream|fast_food"](around:15000,${TOLEDO_LAT},${TOLEDO_LNG});
            node["tourism"~"attraction|museum|aquarium|hotel|winery|gallery|zoo"](around:15000,${TOLEDO_LAT},${TOLEDO_LNG});
            node["leisure"~"park|water_park|sports_centre|stadium"](around:15000,${TOLEDO_LAT},${TOLEDO_LNG});
            node["historic"~"museum|memorial|monument"](around:15000,${TOLEDO_LAT},${TOLEDO_LNG});
            way["tourism"~"attraction|museum|aquarium|winery"](around:15000,${TOLEDO_LAT},${TOLEDO_LNG});
            way["leisure"~"water_park|sports_centre|stadium"](around:15000,${TOLEDO_LAT},${TOLEDO_LNG});
        );
        out center;
    `;

    try {
        const dados = await buscarOSM(query);
        const locais = dados.elements.filter(local => {
            if (!local.tags?.name) return false;
            const nomeOSM = local.tags.name.toLowerCase().trim();
            for (const nomeSeu of nomesCadastrados) {
                if (nomeOSM.includes(nomeSeu) || nomeSeu.includes(nomeOSM)) return false;
            }
            return true;
        });

        localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            dados: locais
        }));

        locais.forEach(local => criarCardOSM(local));
        aplicarFiltros();

    } catch (erro) {
        console.error('Erro ao buscar OpenStreetMap:', erro);
    }
}

function criarCardOSM(local) {
    const nome = local.tags?.name;
    const tipo = local.tags?.amenity
        || local.tags?.tourism
        || local.tags?.leisure
        || local.tags?.historic
        || '';
    const categoria = tipoParaCategoria[tipo] || 'cultural';
    const label = tipoParaLabel[tipo] || 'Local';

    const endereco = local.tags?.['addr:street']
        ? `${local.tags['addr:street']}${local.tags['addr:housenumber'] ? ', ' + local.tags['addr:housenumber'] : ''}`
        : 'Toledo - PR';

    const lat = local.lat ?? local.center?.lat;
    const lon = local.lon ?? local.center?.lon;

    if (!lat || !lon) return;

    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.nome = nome;
    card.dataset.categoria = categoria;
    card.dataset.lat = lat;
    card.dataset.lng = lon;

    card.innerHTML = `
        <div class="sem-foto">📍</div>
        <div class="conteudo-card">
            <div class="categorias-card">
                <span class="categoria-tag ${categoria}">${label}</span>
            </div>
            <h2>${nome}</h2>
            <p>📍 ${endereco}</p>
            <button class="btn-ver-mapa">Ver no mapa</button>
        </div>
    `;

    document.getElementById('resultados').appendChild(card);
    configurarCard(card);
}

document.addEventListener('DOMContentLoaded', () => {
    buscarLocaisOSM();
});