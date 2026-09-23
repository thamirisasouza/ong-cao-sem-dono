/**
 * Módulo de Armazenamento (Storage) - Cão Sem Dono
 * Responsável pelo gerenciamento de dados persistentes via localStorage.
 * Atende aos requisitos da Experiência Prática de ADS:
 * - Utilizar armazenamento local (localStorage) para guardar e recuperar dados;
 * - Inicialização com dados padrão caso o storage esteja vazio;
 * - Operações de CRUD para cadastros e mensagens.
 */

const StorageService = (function () {
    const CHAVE_CADASTROS = "ong_caosemdono_cadastros";
    const CHAVE_MENSAGENS = "ong_caosemdono_mensagens";
    const CHAVE_ANIMAIS = "ong_caosemdono_animais";

    // Dados iniciais de animais para adoção
    const ANIMAIS_INICIAIS = [
        {
            id: 1,
            nome: "Pipoca",
            idade: "2 anos",
            porte: "Médio",
            sexo: "Macho",
            status: "disponivel",
            descricao: "Dócil, castrado, vacinado e adora brincar com crianças.",
            imagem: "imagens/imagensdecaesresgatados.png"
        },
        {
            id: 2,
            nome: "Mel",
            idade: "1 ano",
            porte: "Pequeno",
            sexo: "Fêmea",
            status: "urgente",
            descricao: "Resgatada de atropelamento, 100% recuperada e cheia de carinho para dar.",
            imagem: "imagens/imagensdecaesresgatados.png"
        },
        {
            id: 3,
            nome: "Thor",
            idade: "3 anos",
            porte: "Grande",
            sexo: "Macho",
            status: "adotado",
            descricao: "Adotado com sucesso em nosso último evento de adoção!",
            imagem: "imagens/imagensdecaesresgatados.png"
        }
    ];

    // Dados iniciais de demonstração para voluntários/adotantes
    const CADASTROS_INICIAIS = [
        {
            id: "cad-1",
            nome: "Mariana Silva",
            cpf: "123.456.789-00",
            email: "mariana.silva@exemplo.com",
            telefone: "(11) 98765-4321",
            cidade: "São Paulo",
            estado: "SP",
            ajuda: "voluntario",
            ajudaTexto: "Voluntário(a)",
            mensagem: "Gostaria de ajudar nos eventos de final de semana.",
            dataRegistro: "20/09/2026"
        },
        {
            id: "cad-2",
            nome: "Carlos Eduardo Santos",
            cpf: "234.567.890-11",
            email: "carlos.santos@exemplo.com",
            telefone: "(11) 97654-3210",
            cidade: "São Paulo",
            estado: "SP",
            ajuda: "adocao",
            ajudaTexto: "Adoção de cão",
            mensagem: "Tenho interesse em adotar a Pipoca.",
            dataRegistro: "21/09/2026"
        }
    ];

    /**
     * Inicializa o localStorage caso ainda não haja dados salvos.
     */
    function inicializar() {
        if (!localStorage.getItem(CHAVE_ANIMAIS)) {
            localStorage.setItem(CHAVE_ANIMAIS, JSON.stringify(ANIMAIS_INICIAIS));
        }
        if (!localStorage.getItem(CHAVE_CADASTROS)) {
            localStorage.setItem(CHAVE_CADASTROS, JSON.stringify(CADASTROS_INICIAIS));
        }
        if (!localStorage.getItem(CHAVE_MENSAGENS)) {
            localStorage.setItem(CHAVE_MENSAGENS, JSON.stringify([]));
        }
    }

    /**
     * Retorna a lista de animais
     */
    function obterAnimais() {
        inicializar();
        try {
            return JSON.parse(localStorage.getItem(CHAVE_ANIMAIS)) || ANIMAIS_INICIAIS;
        } catch (e) {
            console.error("Erro ao ler animais do localStorage:", e);
            return ANIMAIS_INICIAIS;
        }
    }

    /**
     * Retorna todos os cadastros salvos
     */
    function obterCadastros() {
        inicializar();
        try {
            return JSON.parse(localStorage.getItem(CHAVE_CADASTROS)) || [];
        } catch (e) {
            console.error("Erro ao ler cadastros do localStorage:", e);
            return [];
        }
    }

    /**
     * Salva um novo cadastro no localStorage
     */
    function salvarCadastro(cadastro) {
        const cadastros = obterCadastros();
        const novo = {
            id: "cad-" + Date.now(),
            dataRegistro: new Date().toLocaleDateString("pt-BR"),
            ...cadastro
        };
        cadastros.unshift(novo); // Insere no início
        localStorage.setItem(CHAVE_CADASTROS, JSON.stringify(cadastros));
        return novo;
    }

    /**
     * Remove um cadastro pelo ID
     */
    function excluirCadastro(id) {
        let cadastros = obterCadastros();
        cadastros = cadastros.filter(c => c.id !== id);
        localStorage.setItem(CHAVE_CADASTROS, JSON.stringify(cadastros));
        return cadastros;
    }

    /**
     * Salva uma mensagem enviada na tela de contato
     */
    function salvarMensagem(mensagem) {
        inicializar();
        try {
            const mensagens = JSON.parse(localStorage.getItem(CHAVE_MENSAGENS)) || [];
            const nova = {
                id: "msg-" + Date.now(),
                dataEnvio: new Date().toLocaleString("pt-BR"),
                ...mensagem
            };
            mensagens.unshift(nova);
            localStorage.setItem(CHAVE_MENSAGENS, JSON.stringify(mensagens));
            return nova;
        } catch (e) {
            console.error("Erro ao salvar mensagem:", e);
            return null;
        }
    }

    // Inicializa na carga
    inicializar();

    return {
        obterAnimais,
        obterCadastros,
        salvarCadastro,
        excluirCadastro,
        salvarMensagem
    };
})();
