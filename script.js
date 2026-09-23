/**
 * Script Unificado / Compatibilidade - Cão Sem Dono
 * Carrega a arquitetura modular da aplicação e garante o funcionamento
 * tanto em modo SPA (Single Page Application) quanto em páginas legadas.
 */

// Se os módulos já estiverem carregados, o App.inicializar cuidará do setup.
// Caso este arquivo seja incluído isoladamente em uma página tradicional:
document.addEventListener("DOMContentLoaded", function () {
    // Menu mobile para páginas estáticas
    const botaoMenu = document.querySelector(".menu-toggle");
    const menuLista = document.querySelector(".menu-lista");

    if (botaoMenu && menuLista) {
        botaoMenu.addEventListener("click", function () {
            menuLista.classList.toggle("ativo");
            const aberto = menuLista.classList.contains("ativo");
            botaoMenu.setAttribute("aria-expanded", aberto);
        });
    }

    // Modal simples se existir elemento local
    const botaoAbrirModal = document.getElementById("abrir-modal");
    const botaoFecharModal = document.getElementById("fechar-modal");
    const modal = document.getElementById("modal-confirmacao");

    if (botaoAbrirModal && botaoFecharModal && modal) {
        botaoAbrirModal.addEventListener("click", function () {
            modal.classList.remove("escondido");
        });
        botaoFecharModal.addEventListener("click", function () {
            modal.classList.add("escondido");
        });
    }

    // Toast simples se existir botão local
    const botaoToast = document.getElementById("mostrar-toast");
    const toast = document.getElementById("toast");

    if (botaoToast && toast) {
        botaoToast.addEventListener("click", function () {
            toast.classList.remove("escondido");
            setTimeout(function () {
                toast.classList.add("escondido");
            }, 3000);
        });
    }
});