/**
 * Módulo de Roteamento SPA (Router) - Cão Sem Dono
 * Implementa navegação fluida em página única (Single Page Application)
 * sem recarregar o navegador, gerenciando histórico, templates e acessibilidade.
 * Atende aos requisitos da Experiência Prática:
 * - Implementar o sistema base para uma navegação de página única (SPA);
 * - Controlar eventos do usuário;
 * - Manipular elementos da página (DOM) para alterar conteúdo dinamicamente.
 */

const Router = (function () {
    const rotas = {
        "/": {
            titulo: "Início | Cão Sem Dono",
            render: Templates.inicio,
            posRender: inicializarInicio
        },
        "/inicio": {
            titulo: "Início | Cão Sem Dono",
            render: Templates.inicio,
            posRender: inicializarInicio
        },
        "/projetos": {
            titulo: "Projetos | Cão Sem Dono",
            render: Templates.projetos,
            posRender: inicializarProjetos
        },
        "/cadastro": {
            titulo: "Cadastro & Adoção | Cão Sem Dono",
            render: Templates.cadastro,
            posRender: inicializarCadastro
        },
        "/contato": {
            titulo: "Contato | Cão Sem Dono",
            render: Templates.contato,
            posRender: inicializarContato
        },
        "/painel": {
            titulo: "Painel de Cadastros | Cão Sem Dono",
            render: Templates.painel,
            posRender: inicializarPainel
        }
    };

    /**
     * Extrai caminho da rota e parâmetros da query string da URL hash
     * Ex: "#/cadastro?ajuda=adocao&animal=Pipoca"
     */
    function obterRotaAtual() {
        const hashCompleto = window.location.hash || "#/";
        const semHash = hashCompleto.startsWith("#") ? hashCompleto.substring(1) : hashCompleto;
        const [caminho, queryString] = semHash.split("?");

        const params = {};
        if (queryString) {
            const pares = queryString.split("&");
            pares.forEach(par => {
                const [chave, valor] = par.split("=");
                if (chave) params[decodeURIComponent(chave)] = decodeURIComponent(valor || "");
            });
        }

        return {
            caminho: caminho || "/",
            params
        };
    }

    /**
     * Renderiza a rota correspondente no container principal
     */
    function navegar() {
        const { caminho, params } = obterRotaAtual();
        const rotaConfig = rotas[caminho] || rotas["/"];
        const appContainer = document.getElementById("app");

        if (!appContainer) {
            console.error("Container principal #app não encontrado no DOM.");
            return;
        }

        // Transição visual suave
        appContainer.classList.add("carregando-conteudo");

        setTimeout(() => {
            // Atualiza conteúdo dinamicamente via template JavaScript
            appContainer.innerHTML = rotaConfig.render(params);
            appContainer.classList.remove("carregando-conteudo");

            // Atualiza título da página
            document.title = rotaConfig.titulo;

            // Atualiza estado ativo nos links de navegação
            atualizarMenuAtivo(caminho);

            // Move foco para acessibilidade (WCAG para SPAs)
            appContainer.setAttribute("tabindex", "-1");
            appContainer.focus({ preventScroll: true });

            // Rola suavemente para o topo se não houver âncora interna
            if (!window.location.hash.includes("#resgate") && 
                !window.location.hash.includes("#voluntariado") && 
                !window.location.hash.includes("#doacoes")) {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }

            // Executa inicializadores e listeners específicos da rota
            if (typeof rotaConfig.posRender === "function") {
                rotaConfig.posRender(params);
            }

            // Se o menu mobile estiver aberto, fecha automaticamente
            const menuLista = document.querySelector(".menu-lista");
            const botaoMenu = document.querySelector(".menu-toggle");
            if (menuLista && menuLista.classList.contains("ativo")) {
                menuLista.classList.remove("ativo");
                if (botaoMenu) botaoMenu.setAttribute("aria-expanded", "false");
            }
        }, 80);
    }

    /**
     * Atualiza o destaque visual da página ativa no menu
     */
    function atualizarMenuAtivo(caminho) {
        const links = document.querySelectorAll(".menu-lista a");
        links.forEach(link => {
            const href = link.getAttribute("href");
            if (!href) return;

            const ehAtivo = 
                (caminho === "/" || caminho === "/inicio") && (href === "#/" || href === "#/inicio" || href === "index.html") ||
                caminho === "/projetos" && href.includes("projetos") ||
                caminho === "/cadastro" && href.includes("cadastro") ||
                caminho === "/contato" && href.includes("contato") ||
                caminho === "/painel" && href.includes("painel");

            if (ehAtivo) {
                link.classList.add("ativo");
                link.setAttribute("aria-current", "page");
            } else {
                link.classList.remove("ativo");
                link.removeAttribute("aria-current");
            }
        });
    }

    /**
     * Inicializador da página inicial: Desenho programático Canvas
     */
    function inicializarInicio() {
        const canvas = document.getElementById("graficoResgates");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Limpa tela
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dados estatísticos dos últimos 6 meses
        const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
        const resgates = [14, 22, 18, 29, 35, 42];
        const adocoes = [10, 16, 15, 24, 30, 38];

        const larguraBarra = 28;
        const espaco = 90;
        const margemEsq = 80;
        const baseLinha = 180;

        // Linhas de grade e fundo
        ctx.strokeStyle = "#DDD2C5";
        ctx.lineWidth = 1;
        for (let l = 0; l <= 4; l++) {
            const y = baseLinha - (l * 35);
            ctx.beginPath();
            ctx.moveTo(margemEsq - 20, y);
            ctx.lineTo(canvas.width - 20, y);
            ctx.stroke();

            // Texto do eixo Y
            ctx.fillStyle = "#68625D";
            ctx.font = "12px Arial";
            ctx.fillText(l * 10, margemEsq - 45, y + 4);
        }

        // Renderiza barras animadas ou desenhadas
        meses.forEach((mes, i) => {
            const x = margemEsq + (i * espaco);

            // Alturas proporcionais
            const hResgate = resgates[i] * 3.5;
            const hAdocao = adocoes[i] * 3.5;

            // Barra Resgate (Laranja/Primária)
            ctx.fillStyle = "#E98A15";
            ctx.fillRect(x, baseLinha - hResgate, larguraBarra, hResgate);

            // Barra Adoção (Grafite/Secundária)
            ctx.fillStyle = "#262321";
            ctx.fillRect(x + larguraBarra + 4, baseLinha - hAdocao, larguraBarra, hAdocao);

            // Rótulo do Mês no eixo X
            ctx.fillStyle = "#262321";
            ctx.font = "bold 13px Arial";
            ctx.fillText(mes, x + 16, baseLinha + 24);
        });
    }

    /**
     * Inicializador da página de Projetos
     */
    function inicializarProjetos() {
        // Se houver âncora como #resgate, faz scroll até o elemento
        const hash = window.location.hash;
        if (hash.includes("#resgate")) {
            const el = document.getElementById("resgate");
            if (el) el.scrollIntoView({ behavior: "smooth" });
        } else if (hash.includes("#voluntariado")) {
            const el = document.getElementById("voluntariado");
            if (el) el.scrollIntoView({ behavior: "smooth" });
        } else if (hash.includes("#doacoes")) {
            const el = document.getElementById("doacoes");
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }
    }

    /**
     * Inicializador da página de Cadastro: Validações e salvamento no localStorage
     */
    function inicializarCadastro() {
        const form = document.getElementById("formCadastro");
        if (!form) return;

        // Configura máscaras e ViaCEP
        ValidationService.configurarFormulario(form);

        // Submissão do formulário
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            // Validações básicas antes de salvar
            const nome = form.nome.value.trim();
            const cpf = form.cpf.value.trim();
            const email = form.email.value.trim();
            const telefone = form.telefone.value.trim();
            const cep = form.cep.value.trim();
            const endereco = form.endereco.value.trim();
            const cidade = form.cidade.value.trim();
            const estado = form.estado.value;
            const ajudaEl = form.querySelector("input[name='ajuda']:checked");
            const ajuda = ajudaEl ? ajudaEl.value : "voluntario";
            const mensagem = form.mensagem.value.trim();
            const termos = form.termos.checked;

            // Limpa erros visuais anteriores
            let temErros = false;
            const camposObrigatorios = [
                { el: form.nome, msg: "Por favor, digite seu nome completo (mínimo 3 caracteres)." },
                { el: form.cpf, msg: "Digite um CPF válido no formato 000.000.000-00." },
                { el: form.telefone, msg: "Informe um telefone válido com DDD (mínimo 10 dígitos)." },
                { el: form.email, msg: "Digite um endereço de e-mail válido (ex: seu@email.com)." },
                { el: form.cep, msg: "Informe um CEP válido com 8 dígitos." },
                { el: form.endereco, msg: "O logradouro é obrigatório." },
                { el: form.cidade, msg: "A cidade é obrigatória." },
                { el: form.estado, msg: "Selecione o estado." }
            ];

            camposObrigatorios.forEach(item => {
                if (!item.el || !item.el.value.trim()) {
                    ValidationService.definirErroCampo(item.el, item.msg);
                    temErros = true;
                } else {
                    ValidationService.definirErroCampo(item.el, "");
                }
            });

            // Validação detalhada de CPF
            if (cpf && !ValidationService.validarCPF(cpf)) {
                ValidationService.definirErroCampo(form.cpf, "CPF inválido! Verifique os números informados.");
                temErros = true;
            }

            // Validação detalhada de E-mail
            if (email && !ValidationService.validarEmail(email)) {
                ValidationService.definirErroCampo(form.email, "Formato de e-mail inválido! Exemplo: nome@provedor.com");
                temErros = true;
            }

            // Validação de Termos
            if (!termos) {
                App.mostrarToast("Você precisa aceitar a declaração de informações verdadeiras.", "aviso");
                temErros = true;
            }

            if (temErros) {
                App.mostrarToast("Existem campos pendentes ou com erros. Revise os campos destacados em vermelho.", "erro");
                const primeiroInvalido = form.querySelector(".campo-invalido");
                if (primeiroInvalido) primeiroInvalido.focus();
                return;
            }

            const mapaNomesAjuda = {
                voluntario: "Voluntário(a)",
                adocao: "Adoção de animal",
                "lar-temporario": "Lar Temporário",
                doacao: "Doações Recorrentes"
            };

            // Salva dados no localStorage através do StorageService
            const registroSalvo = StorageService.salvarCadastro({
                nome,
                cpf,
                email,
                telefone,
                cep,
                endereco,
                cidade,
                estado,
                ajuda,
                ajudaTexto: mapaNomesAjuda[ajuda] || ajuda,
                mensagem
            });

            // Efeito visual com a biblioteca externa acoplada (canvas-confetti)
            if (typeof confetti === "function") {
                try {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                } catch (e) {
                    console.log("Efeito confetti acionado");
                }
            }

            // Feedback dinâmico: Exibe modal de confirmação e Toast
            App.mostrarModal({
                titulo: "🎉 Cadastro Realizado com Sucesso!",
                mensagem: `Obrigado(a), <strong>${nome}</strong>! Sua manifestação de interesse em <strong>${mapaNomesAjuda[ajuda]}</strong> foi registrada com sucesso e armazenada com segurança em nosso banco local (localStorage).`,
                botaoTexto: "Ver no Painel de Cadastros",
                aoConfirmar: () => {
                    window.location.hash = "#/painel";
                }
            });

            App.mostrarToast("Cadastro salvo no localStorage com sucesso!", "sucesso");
            form.reset();
        });
    }

    /**
     * Inicializador da página de Contato
     */
    function inicializarContato() {
        const form = document.getElementById("formContato");
        if (!form) return;

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const nome = form.contatoNome.value.trim();
            const email = form.contatoEmail.value.trim();
            const assunto = form.contatoAssunto.value;
            const mensagem = form.contatoMensagem.value.trim();

            if (!nome || !email || !mensagem) {
                App.mostrarToast("Por favor, preencha os campos obrigatórios.", "aviso");
                return;
            }

            StorageService.salvarMensagem({ nome, email, assunto, mensagem });

            App.mostrarModal({
                titulo: "Mensagem Recebida!",
                mensagem: `Obrigado pelo contato, <strong>${nome}</strong>! Sua mensagem sobre <em>"${assunto}"</em> foi gravada com sucesso. Nossa equipe entrará em contato em breve.`,
                botaoTexto: "Fechar"
            });

            App.mostrarToast("Mensagem enviada com sucesso!", "sucesso");
            form.reset();
        });
    }

    /**
     * Inicializador do Painel Gerencial (Exclusão e Gestão do localStorage)
     */
    function inicializarPainel() {
        const tabelaCorpo = document.getElementById("corpoTabelaCadastros");
        if (!tabelaCorpo) return;

        // Delegação de eventos para exclusão no DOM
        tabelaCorpo.addEventListener("click", function (e) {
            const btnExcluir = e.target.closest("button[data-acao='excluir']");
            if (!btnExcluir) return;

            const id = btnExcluir.getAttribute("data-id");
            if (!id) return;

            if (confirm("Deseja realmente remover este cadastro do localStorage?")) {
                StorageService.excluirCadastro(id);
                App.mostrarToast("Cadastro removido com sucesso!", "sucesso");
                // Re-renderiza o painel dinamicamente sem reload
                Router.navegar();
            }
        });
    }

    /**
     * Intercepta cliques do utilizador em links da interface estática
     * para garantir navegação fluida sem recarregar o documento inteiro.
     */
    function interceptarNavegacao(e) {
        const link = e.target.closest("a");
        if (!link) return;

        const href = link.getAttribute("href");
        if (!href) return;

        // Se for um link interno da aplicação
        if (href.startsWith("#/") || href === "index.html" || href === "cadastro.html" || href === "projetos.html" || href === "contato.html") {
            e.preventDefault();

            let rotaDestino = href;
            if (href === "index.html" || href === "#/") rotaDestino = "#/";
            else if (href === "projetos.html") rotaDestino = "#/projetos";
            else if (href === "cadastro.html") rotaDestino = "#/cadastro";
            else if (href === "contato.html") rotaDestino = "#/contato";

            if (window.location.hash !== rotaDestino) {
                window.location.hash = rotaDestino;
            } else {
                navegar();
            }
        }
    }

    /**
     * Inicia a escuta de rotas e interceptação de intenções de navegação
     */
    function iniciar() {
        document.addEventListener("click", interceptarNavegacao);
        window.addEventListener("hashchange", navegar);
        navegar();
    }

    return {
        iniciar,
        navegar,
        interceptarNavegacao
    };
})();
