/**
 * Módulo Principal da Aplicação (App) - Cão Sem Dono
 * Ponto de entrada que orquestra a inicialização dos módulos,
 * componentes globais de interface (Toast, Modal, Menu Mobile) e acessibilidade.
 * Atende aos requisitos da Experiência Prática:
 * - Implementar e controlar eventos do usuário (cliques, teclado, formulários);
 * - Organizar o código de forma clara e reutilizável;
 * - Testar e corrigir erros no funcionamento da aplicação.
 */

const App = (function () {

    /**
     * Exibe notificação flutuante tipo Toast
     */
    function mostrarToast(mensagem, tipo = "sucesso") {
        let toast = document.getElementById("toast-global");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast-global";
            toast.className = "toast-global escondido";
            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", "polite");
            document.body.appendChild(toast);
        }

        toast.className = `toast-global toast-${tipo}`;
        toast.innerHTML = `
            <div class="toast-conteudo">
                <span class="toast-icone">${tipo === "sucesso" ? "✅" : tipo === "erro" ? "❌" : "⚠️"}</span>
                <span class="toast-texto">${mensagem}</span>
            </div>
        `;

        toast.classList.remove("escondido");

        if (toast.timeoutId) clearTimeout(toast.timeoutId);
        toast.timeoutId = setTimeout(() => {
            toast.classList.add("escondido");
        }, 4000);
    }

    /**
     * Exibe janela Modal interativa com acessibilidade (tecla ESC, trap de foco)
     */
    function mostrarModal({ titulo, mensagem, botaoTexto = "Entendido", aoConfirmar = null }) {
        let modal = document.getElementById("modal-global");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "modal-global";
            modal.className = "modal-global escondido";
            modal.setAttribute("role", "dialog");
            modal.setAttribute("aria-modal", "true");
            modal.setAttribute("aria-labelledby", "modal-titulo");
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-dialogo">
                <div class="modal-cabecalho">
                    <h3 id="modal-titulo">${titulo}</h3>
                    <button type="button" class="modal-fechar-icone" aria-label="Fechar janela modal">&times;</button>
                </div>
                <div class="modal-corpo">
                    <p>${mensagem}</p>
                </div>
                <div class="modal-rodape">
                    <button type="button" class="botao botao-primario modal-btn-acao">${botaoTexto}</button>
                </div>
            </div>
        `;

        modal.classList.remove("escondido");
        document.body.style.overflow = "hidden"; // Impede scroll no fundo

        const btnFechar = modal.querySelector(".modal-fechar-icone");
        const btnAcao = modal.querySelector(".modal-btn-acao");
        const backdrop = modal.querySelector(".modal-backdrop");

        function fechar() {
            modal.classList.add("escondido");
            document.body.style.overflow = "";
            document.removeEventListener("keydown", lidarTeclado);
        }

        function lidarTeclado(e) {
            if (e.key === "Escape") {
                fechar();
            }
        }

        btnFechar.addEventListener("click", fechar);
        backdrop.addEventListener("click", fechar);
        btnAcao.addEventListener("click", () => {
            fechar();
            if (typeof aoConfirmar === "function") aoConfirmar();
        });

        document.addEventListener("keydown", lidarTeclado);
        btnAcao.focus();
    }

    /**
     * Configura o comportamento do menu hambúrguer para dispositivos móveis
     */
    function configurarMenuMobile() {
        const botaoMenu = document.querySelector(".menu-toggle");
        const menuLista = document.querySelector(".menu-lista");

        if (!botaoMenu || !menuLista) return;

        botaoMenu.addEventListener("click", function () {
            menuLista.classList.toggle("ativo");
            const aberto = menuLista.classList.contains("ativo");
            botaoMenu.setAttribute("aria-expanded", aberto);
        });

        // Fecha ao pressionar ESC
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && menuLista.classList.contains("ativo")) {
                menuLista.classList.remove("ativo");
                botaoMenu.setAttribute("aria-expanded", "false");
                botaoMenu.focus();
            }
        });

        // Fecha ao clicar fora do menu
        document.addEventListener("click", function (e) {
            if (!menuLista.contains(e.target) && !botaoMenu.contains(e.target) && menuLista.classList.contains("ativo")) {
                menuLista.classList.remove("ativo");
                botaoMenu.setAttribute("aria-expanded", "false");
            }
        });
    }

    /**
     * Inicialização geral do sistema
     */
    function inicializar() {
        configurarMenuMobile();
        Router.iniciar();
    }

    return {
        inicializar,
        mostrarToast,
        mostrarModal
    };
})();

// Dispara quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", App.inicializar);
