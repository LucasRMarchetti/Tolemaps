const SUPABASE_URL = "https://uaqsbwrhctudlaqmudok.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhcXNid3JoY3R1ZGxhcW11ZG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODQzMzcsImV4cCI6MjA5NDM2MDMzN30.z3PvPtHxm6osOolfZFGPRKFwS6g5Mz3uAKpEdpyVAT0";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const LOCAL = "la_mafia";

const imagensCarrossel = [
    "lamafia01.png"
];

function initCarrossel(images) {
    const imgEl = document.querySelector("#imagemAtual");
    const prevBtn = document.querySelector("#prev");
    const nextBtn = document.querySelector("#next");
    if (!imgEl || !prevBtn || !nextBtn || images.length === 0) return;
    let index = 0;
    function atualizar() {
        imgEl.src = images[index];
        prevBtn.disabled = images.length <= 1;
        nextBtn.disabled = images.length <= 1;
    }
    nextBtn.addEventListener("click", () => { index = (index + 1) % images.length; atualizar(); });
    prevBtn.addEventListener("click", () => { index = (index - 1 + images.length) % images.length; atualizar(); });
    window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") { index = (index + 1) % images.length; atualizar(); }
        if (e.key === "ArrowLeft")  { index = (index - 1 + images.length) % images.length; atualizar(); }
    });
    atualizar();
}

document.addEventListener("DOMContentLoaded", () => { initCarrossel(imagensCarrossel); });

const estrelas = document.querySelectorAll(".estrela");
let avaliacao = 0;

estrelas.forEach(estrela => {
    estrela.addEventListener("click", () => {
        avaliacao = parseInt(estrela.dataset.value);
        estrelas.forEach((e, i) => e.classList.toggle("ativa", i < avaliacao));
    });
    estrela.addEventListener("mouseover", () => {
        const val = parseInt(estrela.dataset.value);
        estrelas.forEach((e, i) => e.classList.toggle("ativa", i < val));
    });
    estrela.addEventListener("mouseout", () => {
        estrelas.forEach((e, i) => e.classList.toggle("ativa", i < avaliacao));
    });
});

const botaoEnviar = document.getElementById("enviar");
const comentarioInput = document.getElementById("comentario");
const lista = document.getElementById("comentarios-lista");

async function carregarComentarios() {
    const { data, error } = await db
        .from("comentarios")
        .select("*")
        .eq("local", LOCAL)
        .order("data", { ascending: false });
    if (error) {
        lista.innerHTML = '<p style="text-align:center;color:#E53E3E;">Erro ao carregar comentários.</p>';
        return;
    }
    if (!data || data.length === 0) {
        lista.innerHTML = '<p style="text-align:center;color:#aaa;padding:1rem;">Nenhum comentário ainda. Seja o primeiro!</p>';
        return;
    }
    lista.innerHTML = "";
    data.forEach(c => {
        const dataFormatada = c.data ? new Date(c.data).toLocaleDateString('pt-BR') : '';
        const inicial = (c.usuario || 'V')[0].toUpperCase();
        const nome = (!c.usuario || c.usuario === 'visitante') ? 'Visitante' : c.usuario;
        const estrelasCheias = '\u2605'.repeat(c.estrelas) + '\u2606'.repeat(5 - c.estrelas);
        const div = document.createElement("div");
        div.classList.add("comentario-item");
        div.innerHTML = '<div class="comentario-header"><div class="comentario-avatar">' + inicial + '</div><div class="comentario-meta"><span class="comentario-usuario">' + nome + '</span><span class="comentario-data">' + dataFormatada + '</span></div></div><div class="comentario-estrelas">' + estrelasCheias + '</div><div class="comentario-texto">' + c.comentario + '</div>';
        lista.appendChild(div);
    });
}

carregarComentarios();

botaoEnviar.addEventListener("click", async () => {
    const texto = comentarioInput.value.trim();
    if (!texto) return alert("Digite um comentário!");
    if (avaliacao === 0) return alert("Selecione uma nota com as estrelas!");
    const { error } = await db.from("comentarios").insert({ local: LOCAL, usuario: "visitante", comentario: texto, estrelas: avaliacao });
    if (error) { alert("Erro ao enviar comentário!"); console.error(error); }
    else { comentarioInput.value = ""; avaliacao = 0; estrelas.forEach(e => e.classList.remove("ativa")); carregarComentarios(); }
});