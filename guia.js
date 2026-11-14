const SUPABASE_URL = "https://uaqsbwrhctudlaqmudok.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhcXNid3JoY3R1ZGxhcW11ZG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODQzMzcsImV4cCI6MjA5NDM2MDMzN30.z3PvPtHxm6osOolfZFGPRKFwS6g5Mz3uAKpEdpyVAT0";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const TOLEDO_LAT = -24.7244;
const TOLEDO_LNG = -53.7449;

const BANCO_ROTAS = [
    {
        id: "gastro",
        nome: "Rota Gastronômica",
        emoji: "🍽️",
        interesses: ["gastro"],
        perfis: ["casal", "amigos", "familia", "solo"],
        tempos: ["meio", "dia"],
        orcamentos: ["eco", "prem"],
        cor: "#e53e3e",
        paradas: [
            { nome: "Restaurante Peixe Frito Pantanal", tipo: "Restaurante", lat: -24.7444324, lng: -53.741043, pagina: "lugares/pantanal/pantanal.html", dica: "Especialidade em frutos do mar" },
            { nome: "Jhonys Gastronomia", tipo: "Restaurante", lat: -24.7207523, lng: -53.7440926, pagina: "lugares/jhonys/jhonys.html", dica: "Gastronomia variada no Shopping" },
            { nome: "La Mafia Trattoria", tipo: "Restaurante", lat: -24.7343883, lng: -53.7589179, pagina: "lugares/la-mafia/la-mafia.html", dica: "Melhor culinária italiana da cidade" },
            { nome: "Aurelius Gastrô & Beer", tipo: "Bar/Restaurante", lat: -24.7208157, lng: -53.7434549, pagina: "lugares/aurelius/aurelius.html", dica: "Cervejas especiais e boa gastronomia" },
        ]
    },
    {
        id: "cultura",
        nome: "Rota Cultural",
        emoji: "🎭",
        interesses: ["cultura"],
        perfis: ["casal", "familia", "solo", "amigos"],
        tempos: ["meio", "dia"],
        orcamentos: ["gratis", "eco", "prem"],
        cor: "#6D7993",
        paradas: [
            { nome: "Teatro Municipal", tipo: "Teatro", lat: -24.7197, lng: -53.7443, pagina: "pesquisa.html", dica: "Apresentações e festivais culturais" },
            { nome: "Lago Municipal Diva Paim Barth", tipo: "Parque", lat: -24.7244, lng: -53.7449, pagina: "lugares/lago/lago.html", dica: "Cartão-postal de Toledo" },
            { nome: "Parque do Povo", tipo: "Parque", lat: -24.7155, lng: -53.7478, pagina: "lugares/lago-novo/lago-novo.html", dica: "Amplo espaço cultural e de lazer" },
        ]
    },
    {
        id: "natureza",
        nome: "Rota Natural",
        emoji: "🌿",
        interesses: ["natureza"],
        perfis: ["familia", "casal", "solo", "amigos"],
        tempos: ["meio", "dia"],
        orcamentos: ["gratis", "eco"],
        cor: "#38a169",
        paradas: [
            { nome: "Lago Municipal Diva Paim Barth", tipo: "Parque Ecológico", lat: -24.7244, lng: -53.7449, pagina: "lugares/lago/lago.html", dica: "Trilhas, academia ao ar livre e natureza" },
            { nome: "Parque do Povo Luiz Cláudio Hoffmann", tipo: "Parque", lat: -24.7155, lng: -53.7478, pagina: "lugares/lago-novo/lago-novo.html", dica: "Caminhada e esportes ao ar livre" },
        ]
    },
    {
        id: "cafe",
        nome: "Rota Café & Doces",
        emoji: "☕",
        interesses: ["cafe"],
        perfis: ["casal", "amigos", "solo", "familia"],
        tempos: ["2h", "meio"],
        orcamentos: ["eco", "prem", "gratis"],
        cor: "#d69e2e",
        paradas: [
            { nome: "Dom Karamello", tipo: "Confeitaria", lat: -24.7208, lng: -53.7438, pagina: "lugares/karamello/karamello.html", dica: "Doces artesanais irresistíveis" },
            { nome: "Go Coffee", tipo: "Café", lat: -24.7225, lng: -53.7443, pagina: "lugares/go-coffee/go-coffee.html", dica: "Cafés especiais em ambiente moderno" },
            { nome: "Milky Moo", tipo: "Sorveteria", lat: -24.7232, lng: -53.7448, pagina: "lugares/milky-moo/milky-moo.html", dica: "Sorvetes artesanais premiados" },
            { nome: "Polaroid Bistrô", tipo: "Bistrô", lat: -24.7311306, lng: -53.745425, pagina: "lugares/polaroid-bistro/polaroid.html", dica: "Opção refinada para um café especial" },
        ]
    },
    {
        id: "noite",
        nome: "Rota Noturna",
        emoji: "🍺",
        interesses: ["noite"],
        perfis: ["amigos", "casal"],
        tempos: ["meio", "dia"],
        orcamentos: ["eco", "prem"],
        cor: "#553c9a",
        paradas: [
            { nome: "Água Doce Cachaçaria", tipo: "Bar", lat: -24.727388, lng: -53.7461708, pagina: "lugares/agua-doce/agua-doce.html", dica: "Drinks especiais e happy-hour" },
            { nome: "Boteco do Mosquito", tipo: "Bar", lat: -24.7238898, lng: -53.7563652, pagina: "lugares/mosquito/mosquito.html", dica: "O boteco mais animado da cidade" },
            { nome: "Irish Pub Toledo", tipo: "Pub", lat: -24.734435, lng: -53.7507425, pagina: "lugares/irish-pub/irish-pub.html", dica: "Estilo irlandês com cervejas especiais" },
            { nome: "Queens Pub Pizzaria", tipo: "Pub/Pizzaria", lat: -24.7198289, lng: -53.7488763, pagina: "lugares/queens/queens.html", dica: "Pizza e chope para grupos grandes" },
            { nome: "A Taberna Colonial", tipo: "Bar", lat: -24.7230303, lng: -53.7418356, pagina: "lugares/taberna-colonial/taberna.html", dica: "Ambiente intimista com boa música" },
        ]
    },
    {
        id: "rapido",
        nome: "Rota Rápida",
        emoji: "⚡",
        interesses: ["gastro", "cafe", "cultura", "natureza", "noite"],
        perfis: ["casal", "amigos", "familia", "solo"],
        tempos: ["2h"],
        orcamentos: ["gratis", "eco", "prem"],
        cor: "#ed8936",
        paradas: [
            { nome: "Lago Municipal Diva Paim Barth", tipo: "Parque", lat: -24.7244, lng: -53.7449, pagina: "lugares/lago/lago.html", dica: "Passeio rápido pelo lago" },
            { nome: "Dom Karamello", tipo: "Café", lat: -24.7208, lng: -53.7438, pagina: "lugares/karamello/karamello.html", dica: "Uma pausa para um café e doce" },
        ]
    },
    {
        id: "familia",
        nome: "Rota Família ao Ar Livre",
        emoji: "👨‍👩‍👧",
        interesses: ["natureza"],
        perfis: ["familia", "casal", "amigos"],
        tempos: ["meio", "dia"],
        orcamentos: ["gratis", "eco"],
        cor: "#0f766e",
        paradas: [
            { nome: "Parque do Povo Luiz Cláudio Hoffmann", tipo: "Parque e esporte", lat: -24.7155, lng: -53.7478, pagina: "lugares/lago-novo/lago-novo.html", dica: "Espaço amplo para brincar, caminhar e praticar esportes" },
            { nome: "Lago Municipal Diva Paim Barth", tipo: "Parque", lat: -24.7244, lng: -53.7449, pagina: "lugares/lago/lago.html", dica: "Passeio tranquilo no cartão-postal da cidade" },
            { nome: "Milky Moo Toledo", tipo: "Sorveteria", lat: -24.7232, lng: -53.7448, pagina: "lugares/milkymoo/milkymoo.html", dica: "Sorvete para fechar o passeio" }
        ]
    },
    {
        id: "caminhada",
        nome: "Rota Caminhada pelo Centro",
        emoji: "🚶",
        interesses: ["natureza", "cultura"],
        perfis: ["solo", "casal", "amigos"],
        tempos: ["2h", "meio"],
        orcamentos: ["gratis", "eco"],
        cor: "#2563eb",
        paradas: [
            { nome: "Teatro Municipal", tipo: "Cultura", lat: -24.7197, lng: -53.7443, pagina: "pesquisa.html", dica: "Comece o passeio pelo principal palco cultural" },
            { nome: "Go Coffee - Toledo", tipo: "Café", lat: -24.7225, lng: -53.7443, pagina: "lugares/gocoffee/gocoffee.html", dica: "Pausa rápida para um café" },
            { nome: "Lago Municipal Diva Paim Barth", tipo: "Caminhada", lat: -24.7244, lng: -53.7449, pagina: "lugares/lago/lago.html", dica: "Finalize com uma volta ao redor do lago" }
        ]
    },
    {
        id: "sabores",
        nome: "Rota Sabores de Toledo",
        emoji: "🍴",
        interesses: ["gastro"],
        perfis: ["casal", "amigos", "familia"],
        tempos: ["meio", "dia"],
        orcamentos: ["eco", "prem"],
        cor: "#c2410c",
        paradas: [
            { nome: "Aurelius Gastrô & Beer", tipo: "Gastronomia", lat: -24.7208157, lng: -53.7434549, pagina: "lugares/aurelius/aurelius.html", dica: "Cervejas especiais e pratos para compartilhar" },
            { nome: "Restaurante Peixe Frito Pantanal", tipo: "Restaurante", lat: -24.7444324, lng: -53.741043, pagina: "lugares/pantanal/pantanal.html", dica: "Peixes e sabores regionais" },
            { nome: "Polaroid Bistrô", tipo: "Bistrô", lat: -24.7311306, lng: -53.745425, pagina: "lugares/polaroid-bistro/polaroid.html", dica: "Uma opção especial para encerrar" }
        ]
    },
    {
        id: "encontro",
        nome: "Rota Encontro a Dois",
        emoji: "✨",
        interesses: ["cafe", "gastro"],
        perfis: ["casal"],
        tempos: ["2h", "meio"],
        orcamentos: ["eco", "prem"],
        cor: "#be185d",
        paradas: [
            { nome: "Dom Karamello", tipo: "Confeitaria", lat: -24.7208, lng: -53.7438, pagina: "lugares/domkaramello/domkaramello.html", dica: "Doces e conversa sem pressa" },
            { nome: "Lago Municipal Diva Paim Barth", tipo: "Passeio", lat: -24.7244, lng: -53.7449, pagina: "lugares/lago/lago.html", dica: "Caminhada leve ao fim da tarde" },
            { nome: "A Taberna Colonial", tipo: "Bar", lat: -24.7230303, lng: -53.7418356, pagina: "lugares/taberna-colonial/taberna.html", dica: "Ambiente intimista para fechar a noite" }
        ]
    },
    {
        id: "amigos",
        nome: "Rota Noite com Amigos",
        emoji: "🎶",
        interesses: ["noite"],
        perfis: ["amigos", "casal"],
        tempos: ["meio", "dia"],
        orcamentos: ["eco", "prem"],
        cor: "#7c3aed",
        paradas: [
            { nome: "Queens Pub Pizzaria e Choperia", tipo: "Pub e pizzaria", lat: -24.7198289, lng: -53.7488763, pagina: "lugares/queens/queens.html", dica: "Pizza, chope e mesa para a turma" },
            { nome: "Sapezal Beer Bar e Conveniência", tipo: "Bar", lat: -24.7242, lng: -53.7462, pagina: "lugares/sapezal/sapezal.html", dica: "Cervejas e clima descontraído" },
            { nome: "Irish Pub Toledo", tipo: "Pub", lat: -24.734435, lng: -53.7507425, pagina: "lugares/irish-pub/irish-pub.html", dica: "Música e atmosfera internacional" }
        ]
    }
];

let mapaLeaflet = null;
let rotaAtual = null;
let layerRota = null;
let eventosProximos = [];
let transporte = "car";
let encontrouCorrespondenciaExata = true;
let filtros = {
    tempo: "meio",
    perfil: "casal",
    interesse: "gastro",
    orcamento: "eco",
    ritmo: "qualquer",
    momento: "qualquer"
};

const ritmoPorRota = {
    gastro: "moderado",
    cultura: "leve",
    natureza: "leve",
    cafe: "leve",
    noite: "animado",
    rapido: "leve",
    familia: "leve",
    caminhada: "moderado",
    sabores: "moderado",
    encontro: "leve",
    amigos: "animado"
};

const momentoPorRota = {
    gastro: ["tarde", "noite"],
    cultura: ["manha", "tarde"],
    natureza: ["manha", "tarde"],
    cafe: ["manha", "tarde"],
    noite: ["noite"],
    rapido: ["manha", "tarde"],
    familia: ["manha", "tarde"],
    caminhada: ["manha", "tarde"],
    sabores: ["tarde", "noite"],
    encontro: ["tarde", "noite"],
    amigos: ["noite"]
};

document.addEventListener("DOMContentLoaded", async () => {
    incorporarLocaisDoCache();
    removerLocaisIndesejados();
    configurarChips();
    configurarTransporte();
    await carregarEventosProximos();
    document.getElementById("btn-gerar").addEventListener("click", gerarRotas);
});

function incorporarLocaisDoCache() {
    const cache = localStorage.getItem("tolemaps_osm_cache");
    if (!cache) return;

    try {
        const { timestamp, dados } = JSON.parse(cache);
        if (!Array.isArray(dados) || Date.now() - timestamp >= 24 * 60 * 60 * 1000) return;

        const gruposPorTipo = {
            restaurant: ["gastro", "sabores"],
            fast_food: ["gastro", "sabores"],
            bar: ["noite", "amigos"],
            pub: ["noite", "amigos"],
            cafe: ["cafe", "encontro"],
            ice_cream: ["cafe", "familia"],
            museum: ["cultura", "caminhada"],
            gallery: ["cultura", "caminhada"],
            park: ["natureza", "familia"],
            water_park: ["natureza", "familia"]
        };

        dados.forEach(local => {
            const tipo = local.tags?.amenity || local.tags?.tourism || local.tags?.leisure || local.tags?.historic;
            const grupos = gruposPorTipo[tipo];
            const lat = local.lat ?? local.center?.lat;
            const lng = local.lon ?? local.center?.lon;
            const nome = local.tags?.name?.trim();
            if (!nome || nome.toLowerCase().includes("ciscopar") || !grupos || !lat || !lng) return;

            grupos.forEach(id => {
                const rota = BANCO_ROTAS.find(item => item.id === id);
                if (!rota || rota.paradas.some(parada => parada.nome === nome)) return;
                rota.paradas.push({
                    nome,
                    tipo: "Descoberta no mapa",
                    lat,
                    lng,
                    pagina: "pesquisa.html",
                    dica: "Local recém-adicionado ao mapa de Toledo"
                });
            });
        });
    } catch (erro) {
        localStorage.removeItem("tolemaps_osm_cache");
        console.warn("Cache de locais ignorado.", erro);
    }
}

function configurarChips() {
    document.querySelectorAll(".chips").forEach(grupo => {
        grupo.querySelectorAll(".chip").forEach(chip => {
            chip.addEventListener("click", () => {
                grupo.querySelectorAll(".chip").forEach(c => c.classList.remove("ativo"));
                chip.classList.add("ativo");
                filtros[grupo.dataset.grupo] = chip.dataset.valor;
            });
        });
    });
}

function configurarTransporte() {
    document.querySelectorAll(".trans-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".trans-btn").forEach(b => b.classList.remove("ativo"));
            btn.classList.add("ativo");
            transporte = btn.dataset.trans;
            if (rotaAtual) {
                renderizarRota(rotaAtual);
                renderizarParadas(rotaAtual);
            }
        });
    });
}

async function carregarEventosProximos() {
    const hoje = new Date().toISOString().split("T")[0];
    const emSete = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    try {
        const { data } = await db
            .from("eventos")
            .select("*")
            .gte("data", hoje)
            .lte("data", emSete)
            .order("data", { ascending: true });

        eventosProximos = data || [];
    } catch (erro) {
        console.warn("Eventos indisponíveis; seguindo com as rotas locais.", erro);
        eventosProximos = [];
    }
}

function filtrarRotas() {
    const avaliarRota = rota => {
        const atendeTempo = rota.tempos.includes(filtros.tempo);
        const atendePerfil = rota.perfis.includes(filtros.perfil);
        const atendeInteresse = rota.interesses.includes(filtros.interesse);
        const atendeOrcamento = rota.orcamentos.includes(filtros.orcamento);
        const atendeRitmo = filtros.ritmo === "qualquer" || ritmoPorRota[rota.id] === filtros.ritmo;
        const atendeMomento = filtros.momento === "qualquer" || momentoPorRota[rota.id]?.includes(filtros.momento);

        const pontuacao = [
            [atendeInteresse, 5],
            [atendePerfil, 4],
            [atendeTempo, 3],
            [atendeOrcamento, 2],
            [atendeRitmo, 2],
            [atendeMomento, 2]
        ].reduce((total, [atende, peso]) => total + (atende ? peso : 0), 0);

        return { rota, atendeTodos: atendeTempo && atendePerfil && atendeInteresse && atendeOrcamento && atendeRitmo && atendeMomento, pontuacao };
    };

    const avaliadas = BANCO_ROTAS.map(avaliarRota);
    const completas = avaliadas.filter(item => item.atendeTodos);
    encontrouCorrespondenciaExata = completas.length > 0;
    if (encontrouCorrespondenciaExata) return completas.map(item => item.rota);

    return avaliadas
        .sort((a, b) => b.pontuacao - a.pontuacao)
        .slice(0, 4)
        .map(item => item.rota);
}

function removerLocaisIndesejados() {
    BANCO_ROTAS.forEach(rota => {
        rota.paradas = rota.paradas.filter(parada =>
            !parada.nome.toLowerCase().includes("ciscopar")
        );
    });
}
function gerarRotas() {
    document.getElementById("layout-resultado").classList.remove("oculto");
    document.getElementById("estado-inicial").classList.add("oculto");

    if (!mapaLeaflet) {
        mapaLeaflet = L.map("mapa-guia").setView([TOLEDO_LAT, TOLEDO_LNG], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors"
        }).addTo(mapaLeaflet);
    }

    mapaLeaflet.invalidateSize();

    const rotas = filtrarRotas();
    const listaEl = document.getElementById("lista-rotas");
    document.querySelector(".col-titulo").textContent = encontrouCorrespondenciaExata
        ? "Rotas sugeridas"
        : "Rotas mais compatíveis";
    listaEl.innerHTML = "";

    if (rotas.length === 0) {
        listaEl.innerHTML = '<p style="color:#aaa;font-size:0.85rem;padding:1rem 0;">Nenhuma rota encontrada para essa combinação. Tente ajustar os filtros.</p>';
        document.getElementById("layout-resultado").classList.remove("oculto");
        document.getElementById("estado-inicial").classList.add("oculto");
        return;
    }

    if (eventosProximos.length > 0) {
        const aviso = document.getElementById("aviso-eventos");
        const texto = document.getElementById("texto-eventos");
        texto.textContent = `${eventosProximos.length} evento(s) acontecendo em Toledo essa semana! Alguns podem aparecer como paradas nas rotas abaixo.`;
        aviso.classList.remove("oculto");
    }

    rotas.forEach((rota, i) => {
        const eventosRota = eventosProximos.filter(e =>
            e.categoria === rota.id ||
            (rota.id === "cultura" && e.categoria === "cultural") ||
            (rota.id === "gastro" && e.categoria === "gastronomia")
        );

        const card = document.createElement("div");
        card.classList.add("card-rota");
        if (i === 0) card.classList.add("ativo");

        card.innerHTML = `
            <div class="cr-topo">
                <span class="cr-emoji">${rota.emoji}</span>
                <span class="cr-nome">${rota.nome}</span>
            </div>
            <div class="cr-tags">
                <span class="cr-tag" style="background:#f0f4f8;color:#6D7993">${rota.paradas.length} paradas</span>
                <span class="cr-tag" style="background:#f0f4f8;color:#6D7993">${duracaoRota(rota)}</span>
                <span class="cr-tag" style="background:#f0f4f8;color:#6D7993">${resumoDeslocamento(rota).distancia}</span>
            </div>
            <div class="cr-meta">
                <span>📍 Toledo - PR</span>
                <span>${transporte === "walk" ? "🚶" : "🚗"} ${resumoDeslocamento(rota).tempo}</span>
            </div>
            ${eventosRota.length > 0 ? `<div class="cr-evento">🎉 ${eventosRota.length} evento(s) essa semana!</div>` : ""}
        `;

        card.addEventListener("click", () => {
            document.querySelectorAll(".card-rota").forEach(c => c.classList.remove("ativo"));
            card.classList.add("ativo");
            exibirRota(rota, eventosRota);
        });

        listaEl.appendChild(card);
    });

    document.getElementById("layout-resultado").classList.remove("oculto");
    document.getElementById("estado-inicial").classList.add("oculto");

    exibirRota(rotas[0], eventosProximos.filter(e =>
        e.categoria === rotas[0].id ||
        (rotas[0].id === "cultura" && e.categoria === "cultural") ||
        (rotas[0].id === "gastro" && e.categoria === "gastronomia")
    ));
}

function duracaoRota(rota) {
    const n = rota.paradas.length;
    if (n <= 2) return "~1h30";
    if (n <= 3) return "~2h30";
    if (n <= 4) return "~3h";
    return "~4h+";
}

function distanciaEntreParadas(primeira, segunda) {
    const raioTerraKm = 6371;
    const latitude1 = primeira.lat * Math.PI / 180;
    const latitude2 = segunda.lat * Math.PI / 180;
    const diferencaLatitude = (segunda.lat - primeira.lat) * Math.PI / 180;
    const diferencaLongitude = (segunda.lng - primeira.lng) * Math.PI / 180;
    const a = Math.sin(diferencaLatitude / 2) ** 2
        + Math.cos(latitude1) * Math.cos(latitude2) * Math.sin(diferencaLongitude / 2) ** 2;
    return raioTerraKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatarDistancia(distanciaKm) {
    return distanciaKm < 1
        ? `${Math.round(distanciaKm * 1000)} m`
        : `${distanciaKm.toFixed(1).replace(".", ",")} km`;
}

function formatarTempo(minutos) {
    if (minutos < 60) return `${Math.max(1, Math.round(minutos))} min`;
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = Math.round(minutos % 60);
    return minutosRestantes > 0 ? `${horas}h${minutosRestantes}min` : `${horas}h`;
}

function resumoDeslocamento(rota) {
    const paradas = rota.paradasFinais || rota.paradas;
    let distanciaTotal = 0;

    for (let indice = 1; indice < paradas.length; indice++) {
        distanciaTotal += distanciaEntreParadas(paradas[indice - 1], paradas[indice]);
    }

    const velocidadeMedia = transporte === "walk" ? 5 : 30;
    return {
        distancia: formatarDistancia(distanciaTotal),
        tempo: formatarTempo((distanciaTotal / velocidadeMedia) * 60)
    };
}

function resumoTrecho(primeira, segunda) {
    const distancia = distanciaEntreParadas(primeira, segunda);
    const velocidadeMedia = transporte === "walk" ? 5 : 30;
    return `${formatarDistancia(distancia)} · ${formatarTempo((distancia / velocidadeMedia) * 60)}`;
}

function exibirRota(rota, eventosRota) {
    rotaAtual = rota;

    const paradasComEventos = [...rota.paradas];
    eventosRota.forEach(evento => {
        paradasComEventos.push({
            nome: `🎉 ${evento.titulo}`,
            tipo: "Evento",
            lat: TOLEDO_LAT + (Math.random() - 0.5) * 0.01,
            lng: TOLEDO_LNG + (Math.random() - 0.5) * 0.01,
            pagina: "eventos.html",
            dica: evento.descricao || "Evento especial esta semana!",
            ehEvento: true
        });
    });

    rotaAtual = { ...rota, paradasFinais: paradasComEventos };
    renderizarRota(rotaAtual);
    renderizarParadas(rotaAtual);
}

function renderizarRota(rota) {
    if (!mapaLeaflet) return;
    if (layerRota) { layerRota.forEach(l => mapaLeaflet.removeLayer(l)); }
    layerRota = [];

    const paradas = rota.paradasFinais || rota.paradas;
    const coordenadas = paradas.map(p => [p.lat, p.lng]);

    const iconeNormal = (num, cor) => L.divIcon({
        className: "",
        html: `<div style="
            width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
            background:${cor};border:2px solid #fff;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 2px 6px rgba(0,0,0,0.3);
        "><span style="transform:rotate(45deg);color:#fff;font-size:11px;font-weight:700;">${num}</span></div>`,
        iconSize: [28, 28], iconAnchor: [14, 28]
    });

    const iconeEvento = L.divIcon({
        className: "",
        html: `<div style="
            width:28px;height:28px;border-radius:50%;
            background:#f59e0b;border:2px solid #fff;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 2px 6px rgba(0,0,0,0.3);font-size:14px;
        ">🎉</div>`,
        iconSize: [28, 28], iconAnchor: [14, 14]
    });

    paradas.forEach((parada, i) => {
        const icone = parada.ehEvento ? iconeEvento : iconeNormal(i + 1, rota.cor);
        const marcador = L.marker([parada.lat, parada.lng], { icon: icone })
            .addTo(mapaLeaflet)
            .bindPopup(`
                <div style="font-family:'Bai Jamjuree',sans-serif;min-width:150px;">
                    <strong style="color:${parada.ehEvento ? '#92400e' : '#2a3040'};font-size:13px;">${parada.nome}</strong><br>
                    <small style="color:#888;">${parada.tipo}</small><br>
                    <small style="color:#555;margin-top:4px;display:block;">${parada.dica}</small>
                    <a href="${parada.pagina}" style="color:${rota.cor};font-size:12px;font-weight:600;text-decoration:none;display:block;margin-top:6px;">Ver detalhes →</a>
                </div>
            `);
        layerRota.push(marcador);
    });

    const linha = L.polyline(coordenadas, {
        color: rota.cor,
        weight: 3,
        opacity: 0.8,
        dashArray: transporte === "walk" ? "8, 6" : null
    }).addTo(mapaLeaflet);
    layerRota.push(linha);

    if (coordenadas.length > 0) {
        mapaLeaflet.fitBounds(L.latLngBounds(coordenadas), { padding: [40, 40] });
    }
}

function renderizarParadas(rota) {
    const paradas = rota.paradasFinais || rota.paradas;
    document.getElementById("paradas-titulo").textContent =
        `${rota.nome} — ${paradas.length} paradas`;

    const lista = document.getElementById("paradas-lista");
    lista.innerHTML = paradas.map((p, i) => `
        <div class="parada-card ${p.ehEvento ? 'evento' : ''}" onclick="window.location.href='${p.pagina}'">
            ${i > 0 ? `<div class="pc-deslocamento">↳ ${resumoTrecho(paradas[i - 1], p)}</div>` : ''}
            <div class="pc-num">${p.ehEvento ? '🎉 Evento' : '#' + (i + 1)}</div>
            <div class="pc-nome">${p.nome}</div>
            <div class="pc-tipo">${p.tipo}</div>
        </div>
    `).join("");
}