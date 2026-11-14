const SUPABASE_URL = "https://uaqsbwrhctudlaqmudok.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhcXNid3JoY3R1ZGxhcW11ZG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODQzMzcsImV4cCI6MjA5NDM2MDMzN30.z3PvPtHxm6osOolfZFGPRKFwS6g5Mz3uAKpEdpyVAT0";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const imagensCarrossel = [
    "queens01.png"
];

function initCarrossel(images, opts = {}) {
    const {
        imgSelector = "#imagemAtual",
        prevSelector = "#prev",
        nextSelector = "#next",
        autoplay = false,
        autoplayInterval = 5000
    } = opts;

    const imgEl = document.querySelector(imgSelector);
    const prevBtn = document.querySelector(prevSelector);
    const nextBtn = document.querySelector(nextSelector);

    if (!imgEl || !prevBtn || !nextBtn) {
        console.warn("Carrossel: elemento(s) não encontrados. Verifique os IDs no HTML.");
        return { destroy: () => { } };
    }

    const preloaded = images.map(src => {
        const i = new Image();
        i.src = src;
        return i;
    });

    let index = 0;
    const length = images.length;

    function atualizarImagem() {
        const src = images[index];
        imgEl.src = src;
        imgEl.alt = src.split("/").pop().replace(/[-_]/g, " ");
        if (length <= 1) {
            prevBtn.disabled = true;
            nextBtn.disabled = true;
        } else {
            prevBtn.disabled = false;
            nextBtn.disabled = false;
        }
    }

    function proximo() {
        index = (index + 1) % length;
        atualizarImagem();
    }

    function anterior() {
        index = (index - 1 + length) % length;
        atualizarImagem();
    }

    nextBtn.addEventListener("click", proximo);
    prevBtn.addEventListener("click", anterior);

    function onKey(e) {
        if (e.key === "ArrowRight") proximo();
        if (e.key === "ArrowLeft") anterior();
    }
    window.addEventListener("keydown", onKey);

    let timer = null;
    if (autoplay && length > 1) {
        timer = setInterval(proximo, autoplayInterval);
        imgEl.addEventListener("mouseenter", () => clearInterval(timer));
        imgEl.addEventListener("mouseleave", () => {
            timer = setInterval(proximo, autoplayInterval);
        });
    }

    if (length > 0) atualizarImagem();
    else {
        imgEl.src = "";
        imgEl.alt = "Sem imagem";
        prevBtn.disabled = true;
        nextBtn.disabled = true;
    }

    return {
        destroy() {
            nextBtn.removeEventListener("click", proximo);
            prevBtn.removeEventListener("click", anterior);
            window.removeEventListener("keydown", onKey);
            if (timer) clearInterval(timer);
        }
    };
}

document.addEventListener("DOMContentLoaded", () => {
    initCarrossel(imagensCarrossel, {
        imgSelector: "#imagemAtual",
        prevSelector: "#prev",
        nextSelector: "#next",
        autoplay: false,
        autoplayInterval: 4000
    });
});

const estrelas = document.querySelectorAll(".estrela");
let avaliacao = 0;

estrelas.forEach(estrela => {
    estrela.addEventListener("click", () => {
        avaliacao = estrela.dataset.value;
        estrelas.forEach(e => e.classList.remove("ativa"));
        for (let i = 0; i < avaliacao; i++) estrelas[i].classList.add("ativa");
    });
});

const botaoEnviar = document.getElementById("enviar");
const comentarioInput = document.getElementById("comentario");
const lista = document.getElementById("comentarios-lista");

async function carregarComentarios() {
    const { data, error } = await db
        .from("comentarios")
        .select("*")
        .eq("local", "lago")
        .order("data", { ascending: false });

    if (error) {
        console.error("Erro ao carregar comentários:", error);
        return;
    }

    lista.innerHTML = "";
    data.forEach(c => {
        const div = document.createElement("div");
        div.classList.add("comentario-item");
        div.innerHTML = `<strong>${"★".repeat(c.estrelas)}</strong><br>${c.comentario}`;
        lista.appendChild(div);
    });
}

carregarComentarios();

botaoEnviar.addEventListener("click", async () => {
    const texto = comentarioInput.value.trim();
    if (!texto) return alert("Digite um comentário!");
    if (avaliacao === 0) return alert("Dê uma nota com as estrelas!");

    const { error } = await db.from("comentarios").insert({
        local: "lago",
        usuario: "visitante",
        comentario: texto,
        estrelas: avaliacao,
    });

    if (error) {
        alert("Erro ao enviar comentário!");
        console.error(error);
    } else {
        comentarioInput.value = "";
        avaliacao = 0;
        estrelas.forEach(e => e.classList.remove("ativa"));
        carregarComentarios();
    }
});
