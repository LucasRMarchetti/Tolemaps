class GerenciadorAuth {
    static getUsuarioLogado() {
        try {
            const usuarioSalvo = localStorage.getItem('usuarioAtual');
            if (usuarioSalvo) {
                const usuario = JSON.parse(usuarioSalvo);
                if (usuario && usuario.email && usuario.nome) {
                    return usuario;
                }
            }
        } catch (error) {
            console.error('Erro ao recuperar usuário:', error);
        }
        return null;
    }

    static estaLogado() {
        return this.getUsuarioLogado() !== null;
    }

    static fazerLogin(usuario) {
        localStorage.setItem('usuarioAtual', JSON.stringify(usuario));
        window.dispatchEvent(new Event('storage'));
    }

    static fazerLogout() {
        localStorage.removeItem('usuarioAtual');
        window.dispatchEvent(new Event('storage'));
    }

    static redirecionarAposLogin(paginaAtual) {
        const usuario = this.getUsuarioLogado();
        if (usuario && paginaAtual.includes('cadastro.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect') || 'paginaIni.html';
            window.location.href = redirect;
        }
    }
}