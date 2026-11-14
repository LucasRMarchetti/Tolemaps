import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://uaqsbwrhctudlaqmudok.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhcXNid3JoY3R1ZGxhcW11ZG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODQzMzcsImV4cCI6MjA5NDM2MDMzN30.z3PvPtHxm6osOolfZFGPRKFwS6g5Mz3uAKpEdpyVAT0";


const supabase = createClient("https://uaqsbwrhctudlaqmudok.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhcXNid3JoY3R1ZGxhcW11ZG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODQzMzcsImV4cCI6MjA5NDM2MDMzN30.z3PvPtHxm6osOolfZFGPRKFwS6g5Mz3uAKpEdpyVAT0");

document.addEventListener('DOMContentLoaded', function () {
    const abas = document.querySelectorAll('.aba');
    const formularios = document.querySelectorAll('.formulario-autenticacao');
    const botoesAlternarSenha = document.querySelectorAll('.alternar-senha');
    const seletorTipo = document.getElementById('tipoConta');
    const linhaChaveMestre = document.getElementById('linhaChaveMestre');

    abas.forEach(aba => {
        aba.addEventListener('click', () => {
            const alvo = aba.getAttribute('data-aba');

            abas.forEach(a => a.classList.remove('active'));
            formularios.forEach(f => f.classList.remove('active'));

            aba.classList.add('active');
            document.getElementById(alvo === 'login' ? 'formularioLogin' : 'formularioCadastro').classList.add('active');
        });
    });

    botoesAlternarSenha.forEach(botao => {
        botao.addEventListener('click', () => {
            const idAlvo = botao.getAttribute('data-alvo');
            const entrada = document.getElementById(idAlvo);
            const tipo = entrada.type === 'password' ? 'text' : 'password';
            entrada.type = tipo;

            const svg = botao.querySelector('svg');
            if (tipo === 'text') {
                svg.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
            } else {
                svg.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
            }
        });
    });

    if (seletorTipo && linhaChaveMestre) {
        seletorTipo.addEventListener('change', () => {
            if (seletorTipo.value === 'admin' || seletorTipo.value === 'moderador') {
                linhaChaveMestre.classList.remove('oculto');
            } else {
                linhaChaveMestre.classList.add('oculto');
            }
        });
    }
});

async function carregarBcrypt() {
    return new Promise((resolve) => {
        if (window.dcodeIO && window.dcodeIO.bcrypt) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/bcryptjs@2.4.3/dist/bcrypt.min.js";
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

function exibirMensagem(elemento, texto, ehErro = true) {
    if (!elemento) return;

    elemento.textContent = texto;
    elemento.className = ehErro ? 'mensagem erro' : 'mensagem sucesso';
    elemento.style.display = 'block';

    setTimeout(() => {
        elemento.textContent = '';
        elemento.className = '';
    }, 4000);
}

document.getElementById('formularioCadastro').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeCompleto').value.trim();
    const email = document.getElementById('emailCadastro').value.trim().toLowerCase();
    const senha = document.getElementById('senhaCadastro').value;
    const senhaConfirmacao = document.getElementById('confirmarSenha').value;
    const tipo = document.getElementById('tipoConta').value;
    const chaveMestre = document.getElementById('chaveMestre').value;
    const mensagemCadastro = document.getElementById('mensagemCadastro');

    if (!nome || !email || !senha) {
        return exibirMensagem(mensagemCadastro, "Preencha todos os campos.");
    }

    if (senha !== senhaConfirmacao) {
        return exibirMensagem(mensagemCadastro, "As senhas não coincidem.");
    }

    if ((tipo === 'admin' || tipo === 'moderador') && chaveMestre !== CHAVE_MESTRE) {
        return exibirMensagem(mensagemCadastro, "Chave mestre incorreta.");
    }

    try {
        await carregarBcrypt();

        const { data: existe, error: erroExistencia } = await supabase
            .from("usuarios")
            .select("email")
            .eq("email", email)
            .maybeSingle();

        if (erroExistencia) {
            console.error('Erro ao verificar email:', erroExistencia);
            return exibirMensagem(mensagemCadastro, "Erro ao verificar e-mail.");
        }

        if (existe) {
            return exibirMensagem(mensagemCadastro, "E-mail já cadastrado.");
        }

        const hash = window.dcodeIO.bcrypt.hashSync(senha, 10);

        const dadosUsuario = {
            email,
            nome,
            hashed_password: hash
        };

        const { error } = await supabase
            .from("usuarios")
            .insert([dadosUsuario]);

        if (error) {
            console.error('Erro ao cadastrar:', error);
            return exibirMensagem(mensagemCadastro, "Erro ao cadastrar: " + error.message);
        }

        exibirMensagem(mensagemCadastro, "Cadastro realizado com sucesso!", false);
        e.target.reset();

    } catch (error) {
        console.error('Erro no cadastro:', error);
        exibirMensagem(mensagemCadastro, "Erro inesperado: " + error.message);
    }
});

document.getElementById('formularioLogin').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('emailLogin').value.trim().toLowerCase();
    const senha = document.getElementById('senhaLogin').value;
    const mensagemLogin = document.getElementById('mensagemLogin');

    if (!email || !senha) {
        return exibirMensagem(mensagemLogin, "Preencha e-mail e senha.");
    }

    try {
        await carregarBcrypt();

        const { data, error } = await supabase
            .from("usuarios")
            .select("email, nome, hashed_password")
            .eq("email", email)
            .maybeSingle();

        if (error) {
            console.error('Erro ao buscar usuário:', error);
            return exibirMensagem(mensagemLogin, "Erro ao buscar usuário.");
        }

        if (!data) {
            return exibirMensagem(mensagemLogin, "E-mail não encontrado.");
        }

        const corresponde = window.dcodeIO.bcrypt.compareSync(senha, data.hashed_password);
        if (!corresponde) {
            return exibirMensagem(mensagemLogin, "Senha incorreta.");
        }

        localStorage.setItem("usuarioAtual", JSON.stringify({
            email: data.email,
            nome: data.nome
        }));

        exibirMensagem(mensagemLogin, `Bem-vindo, ${data.nome}!`, false);

        setTimeout(() => {
            // Verificar se veio de alguma página específica
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect');

            if (redirect) {
                window.location.href = redirect;
            } else {
                window.location.href = "paginaIni.html";
            }
        }, 1500);

    } catch (error) {
        console.error('Erro no login:', error);
        exibirMensagem(mensagemLogin, "Erro inesperado no login.");
    }
});