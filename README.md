# Cão Sem Dono - Plataforma Web & Single Page Application (SPA)

> Projeto desenvolvido para o curso de **Análise e Desenvolvimento de Sistemas (ADS)** na disciplina de **Desenvolvimento Front-end para Web**.  
> **Estudante:** Thamiris Alves de Souza  
> **RGM:** 49791052  

---

## Descrição

O **Cão Sem Dono** é uma aplicação web interativa e Single Page Application (SPA) voltada para a gestão, conscientização, captação de voluntários e incentivo à adoção responsável de animais resgatados.

A aplicação foi concebida para transformar uma interface estática em uma plataforma dinâmica e fluida, aplicando conceitos fundamentais do ecossistema front-end moderno:
- **Navegação SPA fluida** sem recarregamento de página, gerenciando rotas, histórico do navegador (`hashchange`) e acessibilidade.
- **Sistema de Templates JavaScript** modularizado para compor páginas e reaproveitar componentes visuais (cards, badges, alertas, formulários e painéis).
- **Manipulação avançada do DOM** e controle de eventos do usuário (cliques, atalhos de teclado, submissão de formulários, input com máscaras).
- **Persistência de dados com `localStorage`**, simulando um ambiente produtivo real onde novos cadastros de voluntários e adotantes são armazenados, consultados e gerenciados.
- **Validações robustas e assíncronas**, incluindo cálculo de dígitos verificadores de CPF, máscaras dinâmicas e integração com a API pública do **ViaCEP** para preenchimento automático de endereço.
- **Acessibilidade e usabilidade (WCAG / WAI-ARIA)**, incluindo atalhos para pular a navegação (*skip links*), foco programático em modais, compatibilidade com leitores de tela e contraste visual.

---

## Tecnologias Utilizadas

- **HTML5 Semântico:** Marcação estrutural moderna (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<details>`, `<summary>`, `<canvas>`, `<datalist>`);
- **CSS3 Moderno:** Design System com variáveis CSS (`:root`), Flexbox, CSS Grid (12 colunas), transições, pseudo-elementos (`::after`) e responsividade *mobile-first*;
- **JavaScript (ES6+):** Arquitetura modularizada por responsabilidade funcional, manipulação dinâmica do DOM, Promises/Async-Await e controle de eventos;
- **Web Storage API (`localStorage`):** Persistência de dados no cliente para armazenamento de cadastros e mensagens;
- **API Pública ViaCEP:** Consulta assíncrona com `fetch()` para preenchimento inteligente de logradouro, bairro, cidade e UF;
- **HTML5 Canvas API:** Geração de gráficos estatísticos de impacto através de desenho programático via JavaScript.

---

## Instalação e Execução

A aplicação é construída com tecnologias nativas da web (Vanilla JavaScript, HTML5 e CSS3) e não exige a instalação de pacotes externos ou servidores complexos.

### Como Executar Localmente:

1. **Clonar ou Baixar o Repositório:**
   ```bash
   git clone https://github.com/usuario/ong-caosemdono.git
   cd "Projetos ADS"
   ```

2. **Executar via Navegador:**
   - Basta abrir o arquivo `index.html` diretamente em qualquer navegador moderno (Google Chrome, Firefox, Microsoft Edge, Safari);
   - Ou utilize extensões como o **Live Server** no VS Code para uma experiência de desenvolvimento com *Hot Reload*:
     ```bash
     # Caso possua o pacote http-server globalmente via Node.js:
     npx http-server . -p 8080
     ```
   - Acesse `http://localhost:8080` no seu navegador.

---

## Estrutura do Projeto

A organização de diretórios e arquivos segue a separação lógica e técnica preconizada nas boas práticas de desenvolvimento front-end:

```text
Projetos ADS/
├── index.html              # Casca da SPA com container dinâmico #app
├── cadastro.html           # Página autônoma de cadastro com validação e ViaCEP
├── projetos.html           # Página de projetos com âncoras e FAQ interativo
├── contato.html            # Página de contato com formulário e mapa acessível
├── script.js               # Carregador de compatibilidade retroativa
├── style.css               # Design System, variáveis CSS e responsividade
├── README.md               # Documentação técnica e acadêmica do projeto
├── css/
│   └── style.css           # Cópia modularizada dos estilos da aplicação
├── js/
│   ├── app.js              # Inicializador da aplicação, Toast e Modais globais
│   ├── router.js           # Roteador SPA client-side e gerenciador de histórico
│   ├── templates.js        # Sistema de templates e componentes dinâmicos
│   ├── validation.js       # Máscaras de entrada, validação de CPF e API ViaCEP
│   └── storage.js          # Módulo de persistência via localStorage (CRUD)
├── html/                   # Páginas autônomas organizadas em pasta própria
│   ├── cadastro.html
│   ├── projetos.html
│   └── contato.html
├── imagens/
│   ├── logo.jpg            # Logotipo oficial da ONG
│   └── imagensdecaesresgatados.png # Imagens dos animais resgatados
└── aulas/
    └── Modulo-FrontEnd.md  # Material didático de referência do módulo
```

---

## Padrão de Modularização e Comunicação entre Arquivos

Para garantir clareza técnica e consistência arquitetural, a aplicação adota oficialmente o **Module Pattern com IIFE (Immediately Invoked Function Expressions)** carregado via tags `<script>` ordenadas no HTML.

### Justificativa da Escolha Técnica
Diferente dos ES Modules (`import`/`export`), que exigem um servidor web ativo para contornar restrições de CORS ao rodar em `file:///`, o **Module Pattern com IIFE**:
1. Funciona nativamente em **qualquer ambiente** (abrindo diretamente no navegador com duplo clique ou via servidor);
2. **Protege o escopo interno:** variáveis e funções privadas não vazam para a memória global (`window`);
3. **Expõe uma interface pública limpa**, permitindo que outros módulos consumam apenas os métodos autorizados.

### Exemplo Mínimo: Como um Arquivo "Expõe" e Outro "Consome"

#### 1. Arquivo que EXPÕE (`js/storage.js`):
```javascript
// O módulo encapsula sua lógica em uma IIFE e retorna apenas métodos públicos
const StorageService = (function () {
    // Variável privada (inacessível externamente)
    const CHAVE = "ong_caosemdono_cadastros";

    // Função pública exposta
    function salvarCadastro(dados) {
        const lista = obterCadastros();
        lista.push(dados);
        localStorage.setItem(CHAVE, JSON.stringify(lista));
        return dados;
    }

    function obterCadastros() {
        return JSON.parse(localStorage.getItem(CHAVE)) || [];
    }

    // Retorna a interface pública do módulo
    return {
        salvarCadastro,
        obterCadastros
    };
})();
```

#### 2. Arquivo que CONSOME (`js/router.js`):
```javascript
// O módulo router consome a funcionalidade sem se preocupar com os detalhes internos do localStorage
function inicializarCadastro() {
    const form = document.getElementById("formCadastro");
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const novoVoluntario = {
            nome: form.nome.value,
            ajuda: "voluntario"
        };

        // CONSUMO: Invoca o método público exposto pelo StorageService
        StorageService.salvarCadastro(novoVoluntario);

        App.mostrarToast("Cadastro salvo com sucesso no localStorage!", "sucesso");
    });
}
```

#### 3. Ordem de Carregamento no `index.html`:
Os scripts são carregados no final do documento respeitando a árvore de dependências (primeiro os serviços e templates, depois o roteador e orquestrador):
```html
<script src="js/storage.js"></script>     <!-- 1. Camada de dados -->
<script src="js/validation.js"></script>  <!-- 2. Validações e regras -->
<script src="js/templates.js"></script>   <!-- 3. Geração de HTML -->
<script src="js/router.js"></script>      <!-- 4. Roteador SPA -->
<script src="js/app.js"></script>         <!-- 5. Entrada e orquestração -->
```

---

## Estratégia de Versionamento e Commits Semânticos

O controle de versões do projeto segue as convenções profissionais recomendadas pela indústria:

### 1. Modelo de Branching (GitFlow Simplificado)
- **`main`:** Código estável, testado e pronto para produção (utilizado para deploy no GitHub Pages);
- **`develop`:** Branch de integração contínua onde as funcionalidades consolidadas se encontram;
- **`feature/*`:** Branches temporárias para o desenvolvimento de módulos específicos (ex: `feature/spa-router`, `feature/form-validation`, `feature/wcag-accessibility`).

```bash
# Fluxo de comandos do GitFlow aplicado no projeto:
git checkout -b develop                  # Cria e alterna para a branch de desenvolvimento
git checkout -b feature/spa-router       # Cria branch para nova funcionalidade
git commit -m "feat: implementa roteador SPA client-side com hash"
git checkout develop                     # Retorna para a branch de desenvolvimento
git merge --no-ff feature/spa-router     # Integra a funcionalidade com commit explícito de merge
git branch -d feature/spa-router         # Remove a branch temporária da funcionalidade
git checkout main                        # Alterna para a branch de produção
git merge --no-ff develop                # Lança a versão final consolidada
```

### 2. Padrão de Commits Semânticos (Conventional Commits)
- `feat:` Adição de nova funcionalidade (ex: `feat: implementa roteador SPA client-side`);
- `fix:` Correção de bug ou anomalia (ex: `fix: trata erro de conexão no ViaCEP`);
- `docs:` Alterações na documentação (ex: `docs: atualiza instruções de deploy no README`);
- `style:` Ajustes puramente visuais e formatação sem alteração de lógica (ex: `style: refina contraste de cores para WCAG AA`);
- `refactor:` Refatoração interna de código para melhoria de manutenibilidade (ex: `refactor: modulariza storage em IIFE`);
- `test:` Adição ou correção de testes (ex: `test: adiciona verificação de dígitos de CPF`).

### 3. Histórico de Releases Semânticas (SemVer)
- **`v1.0.0`**: Estrutura inicial do projeto com HTML5 semântico, CSS3 responsivo e design system base.
- **`v1.1.0`**: Transformação da aplicação em Single Page Application (SPA) e criação de templates dinâmicos.
- **`v1.2.0`**: Implementação das validações de formulário, máscaras, cálculo real de CPF e API ViaCEP.
- **`v1.3.0`**: Persistência com localStorage, painel de dados, acessibilidade WCAG 2.1 AA e documentação final.

### 4. Gestão de Tarefas e Colaboração (GitHub)
- **Milestone:** `Entrega Final - Experiência Prática Front-End` (acompanha o prazo e o conjunto total de entregas).
- **Issues:** Cadastradas para cada tarefa ou melhoria técnica (ex: `#1 - Criar roteamento SPA`, `#2 - Validação de CPF e ViaCEP`, `#3 - Auditoria de Acessibilidade WCAG AA`).
- **Pull Requests (PRs):** Utilizados para revisar e aprovar o merge de cada `feature/*` na branch `develop`, com checklist e descrição detalhada antes da integração.

---

## Conformidade com Diretrizes de Acessibilidade (WCAG 2.1 - Nível AA)

A aplicação foi auditada e construída sob os quatro princípios da acessibilidade digital:

1. **Perceptível:**
   - **Textos Alternativos:** Todas as imagens possuem o atributo `alt` detalhado (ex: `alt="Cão Mel para adoção responsável"`), permitindo que deficientes visuais compreendam o conteúdo visual;
   - **Contraste Cromático:** As cores do Design System atendem à proporção mínima de contraste de **4.5:1** para textos normais em conformidade com o Nível AA da WCAG 2.1;
   - **Legendas e Gráficos:** O elemento `<canvas>` possui `aria-label` e legenda descritiva em HTML puro.

2. **Operável:**
   - **Navegação por Teclado:** Toda a interface pode ser percorrida via tecla `Tab` e `Shift+Tab`, sem armadilhas de foco (*keyboard traps*);
   - **Skip Link:** O atalho `<a href="#app" class="pular-navegacao">Pular para o conteúdo principal</a>` permite saltar o cabeçalho diretamente para o conteúdo;
   - **Atalho de Escape:** Menus mobile e janelas modais fecham instantaneamente ao pressionar a tecla `Escape`.

3. **Compreensível:**
   - **Validações Acessíveis:** Campos com erro recebem o atributo `aria-invalid="true"` e mensagens de erro dinâmicas associadas com `role="alert"` e `aria-live="polite"`;
   - **Textos de Ajuda:** Inputs contam com instruções prévias associadas via `aria-describedby` (ex: formatação de CPF e CEP);
   - **Idioma:** Declaração explícita do idioma principal através de `<html lang="pt-BR">`.

4. **Robusto:**
   - **Marcação Semântica:** Uso rigoroso de tags HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<details>`, `<summary>`, `<figcaption>`, `<footer>`) sem abuso de `<div>` genéricas;
   - **WAI-ARIA:** Atributos de estado sincronizados (`aria-expanded`, `aria-controls`, `aria-modal="true"`).

---

## Deploy

A aplicação está preparada para publicação estática em servidores modernos e plataformas de hospedagem contínua (CI/CD):

- **GitHub Pages:**
  1. No repositório do projeto no GitHub, acesse **Settings > Pages**;
  2. Selecione a branch `main` e a pasta `/ (root)`;
  3. Salve para disponibilizar o site imediatamente com certificado HTTPS gratuito.
- **Vercel / Netlify:**
  1. Conecte o repositório Git;
  2. Defina o diretório de publicação como raiz (`.`);
  3. Deploy automático a cada *push*.

---

## Contribuição

Para contribuir com o projeto:
1. Faça um Fork do repositório;
2. Crie uma branch para sua funcionalidade (`git checkout -b feature/nova-funcionalidade`);
3. Faça commit das suas alterações (`git commit -m 'feat: adiciona componente X'`);
4. Envie para o branch remoto (`git push origin feature/nova-funcionalidade`);
5. Abra um Pull Request detalhando as melhorias propostas.

---

## Licença

Este projeto é desenvolvido para fins exclusivamente acadêmicos e educacionais sob a licença **MIT**.
