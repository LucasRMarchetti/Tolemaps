const SUPABASE_URL = "https://uaqsbwrhctudlaqmudok.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhcXNid3JoY3R1ZGxhcW11ZG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODQzMzcsImV4cCI6MjA5NDM2MDMzN30.z3PvPtHxm6osOolfZFGPRKFwS6g5Mz3uAKpEdpyVAT0";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const MESES_ABREV = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

let todosEventos = [];
let mesFiltro = "todos";
let calAno, calMes;
let diasComEvento = new Set();

async function carregarEventos() {
    const lista = document.getElementById('lista-eventos');

    const { data, error } = await db
        .from("eventos")
        .select("*")
        .order("data", { ascending: true });

    if (error) {
        lista.innerHTML = '<p class="sem-eventos">Erro ao carregar eventos.</p>';
        console.error(error);
        return;
    }

    todosEventos = data || [];
    diasComEvento = new Set(todosEventos.map(e => e.data));
    renderizarEventos();
    renderizarCalendario();
}

function renderizarEventos() {
    const lista = document.getElementById('lista-eventos');
    const hoje = new Date().toISOString().split('T')[0];

    let filtrados = todosEventos.filter(e => e.data >= hoje);

    if (mesFiltro !== "todos") {
        filtrados = filtrados.filter(e => {
            const mes = parseInt(e.data.split('-')[1]);
            return mes === parseInt(mesFiltro);
        });
    }

    if (filtrados.length === 0) {
        lista.innerHTML = '<p class="sem-eventos">Nenhum evento encontrado para este período.</p>';
        return;
    }

    lista.innerHTML = filtrados.map(evento => {
        const data = new Date(evento.data + 'T00:00:00');
        const dia = data.getDate();
        const mes = MESES_ABREV[data.getMonth()];
        const tag = evento.categoria || 'outro';

        return `
            <div class="card-evento">
                <div class="evento-data-box">
                    <div class="dia">${dia}</div>
                    <div class="mes-abrev">${mes}</div>
                </div>
                <div class="evento-corpo">
                    <div class="evento-rodape" style="margin-bottom:6px;">
                        <span class="evento-tag ${tag}">${traduzirCategoria(tag)}</span>
                    </div>
                    <h3>${evento.titulo}</h3>
                    <p>${evento.descricao || ''}</p>
                    <div class="evento-rodape">
                        ${evento.local ? `<span class="meta-item">📍 ${evento.local}</span>` : ''}
                        ${evento.hora  ? `<span class="meta-item">🕐 ${evento.hora}</span>` : ''}
                        ${evento.gratuito ? `<span class="meta-item" style="color:#8AC53F;font-weight:600;">✓ Gratuito</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function traduzirCategoria(cat) {
    const map = {
        gastronomia: 'Gastronomia',
        cultural:    'Cultural',
        agro:        'Agronegócio',
        esporte:     'Esporte',
        musica:      'Música',
        religioso:   'Religioso',
        outro:       'Evento',
    };
    return map[cat] || 'Evento';
}

const filtrosBtns = document.querySelectorAll('.mes-btn');
filtrosBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filtrosBtns.forEach(b => b.classList.remove('ativo'));
        btn.classList.add('ativo');
        mesFiltro = btn.dataset.mes;
        renderizarEventos();
    });
});

const agora = new Date();
calAno = agora.getFullYear();
calMes = agora.getMonth();

function renderizarCalendario() {
    document.getElementById('cal-titulo').textContent = `${MESES[calMes]} ${calAno}`;

    const grid = document.getElementById('cal-grid');
    grid.innerHTML = '';

    const primeiroDia = new Date(calAno, calMes, 1).getDay();
    const diasNoMes = new Date(calAno, calMes + 1, 0).getDate();
    const diasMesAnterior = new Date(calAno, calMes, 0).getDate();
    const hoje = new Date().toISOString().split('T')[0];

    for (let i = primeiroDia - 1; i >= 0; i--) {
        const div = document.createElement('div');
        div.classList.add('cal-dia', 'outro-mes');
        div.textContent = diasMesAnterior - i;
        grid.appendChild(div);
    }

    for (let d = 1; d <= diasNoMes; d++) {
        const div = document.createElement('div');
        div.classList.add('cal-dia');
        div.textContent = d;

        const dataStr = `${calAno}-${String(calMes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

        if (dataStr === hoje) div.classList.add('hoje');

        if (diasComEvento.has(dataStr)) {
            div.classList.add('tem-evento');
            div.title = 'Há eventos neste dia';
            div.addEventListener('click', () => {
                filtrosBtns.forEach(b => b.classList.remove('ativo'));
                mesFiltro = String(calMes + 1);
                renderizarEventos();
                document.getElementById('secao-lista').scrollIntoView({ behavior: 'smooth' });
            });
        }

        grid.appendChild(div);
    }

    const totalCelulas = primeiroDia + diasNoMes;
    const restantes = totalCelulas % 7 === 0 ? 0 : 7 - (totalCelulas % 7);
    for (let i = 1; i <= restantes; i++) {
        const div = document.createElement('div');
        div.classList.add('cal-dia', 'outro-mes');
        div.textContent = i;
        grid.appendChild(div);
    }
}

document.getElementById('cal-prev').addEventListener('click', () => {
    calMes--;
    if (calMes < 0) { calMes = 11; calAno--; }
    renderizarCalendario();
});

document.getElementById('cal-next').addEventListener('click', () => {
    calMes++;
    if (calMes > 11) { calMes = 0; calAno++; }
    renderizarCalendario();
});

document.addEventListener('DOMContentLoaded', carregarEventos);