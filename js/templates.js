/**
 * Módulo de Templates JavaScript (Templates) - Cão Sem Dono
 * Sistema de templates dinâmicos para a Single Page Application (SPA).
 * Atende aos requisitos da Experiência Prática:
 * - Implementar sistema de templates JavaScript;
 * - Gerar templates dinâmicos que permitam reaproveitamento de componentes visuais;
 * - Renderização dinâmica a partir de dados do Storage e estado da aplicação.
 */

const Templates = (function () {

    /**
     * Componente Reutilizável: Badge de Status do Animal
     */
    function templateBadgeStatus(status) {
        const mapa = {
            disponivel: { classe: "badge-disponivel", texto: "Disponível para Adoção" },
            urgente: { classe: "badge-urgente", texto: "Caso Urgente" },
            adotado: { classe: "badge-adotado", texto: "Adotado com Amor ❤️" }
        };
        const badge = mapa[status] || { classe: "badge-disponivel", texto: status };
        return `<span class="badge ${badge.classe}">${badge.texto}</span>`;
    }

    /**
     * Componente Reutilizável: Card de Animal para Adoção
     */
    function templateCardAnimal(animal) {
        return `
            <article class="card card-animal col-4" data-id="${animal.id}">
                <div class="card-img-container">
                    <img src="${animal.imagem}" alt="Cão ${animal.nome} para adoção responsável" class="card-img" loading="lazy">
                    <div class="card-badge-flutuante">
                        ${templateBadgeStatus(animal.status)}
                    </div>
                </div>
                <div class="card-corpo">
                    <h3 class="card-titulo">${animal.nome}</h3>
                    <p class="card-detalhes">
                        <strong>Porte:</strong> ${animal.porte} | <strong>Idade:</strong> ${animal.idade} | <strong>Sexo:</strong> ${animal.sexo}
                    </p>
                    <p class="card-descricao">${animal.descricao}</p>
                    ${animal.status !== "adotado" 
                        ? `<a href="#/cadastro?ajuda=adocao&animal=${encodeURIComponent(animal.nome)}" class="botao botao-adotar" data-rota>Quero Adotar ${animal.nome}</a>`
                        : `<button class="botao botao-secundario" disabled>Já possui uma família</button>`
                    }
                </div>
            </article>
        `;
    }

    /**
     * Template da Página Inicial (Início)
     */
    function inicio() {
        const animais = StorageService.obterAnimais();
        const cadastros = StorageService.obterCadastros();
        const cardsAnimaisHTML = animais.map(templateCardAnimal).join("");

        return `
            <section class="apresentacao-hero">
                <div class="hero-conteudo">
                    <span class="subtitulo-destaque">🐾 Amor, Respeito e Proteção Animal</span>
                    <h2>Dê uma nova chance para um amigo de quatro patas</h2>
                    <p>
                        A ONG <strong>Cão Sem Dono</strong> atua incansavelmente no resgate, reabilitação e
                        encaminhamento para adoção de cães em situação de risco e abandono. Junte-se a nós!
                    </p>
                    <div class="hero-botoes">
                        <a href="#/cadastro?ajuda=adocao" class="botao" data-rota>Adotar um Cão</a>
                        <a href="#/projetos" class="botao botao-secundario" data-rota>Conhecer Projetos</a>
                    </div>
                </div>
                <figure class="hero-imagem">
                    <img src="imagens/imagensdecaesresgatados.png" alt="Cães resgatados pela ONG Cão Sem Dono felizes e saudáveis">
                    <figcaption>Cães resgatados recebendo amor e atendimento de nossa equipe.</figcaption>
                </figure>
            </section>

            <!-- CANVAS INTERATIVO: Estatísticas de Impacto da ONG -->
            <section class="estatisticas-canvas-container">
                <div class="cabecalho-secao">
                    <h2>Nosso Impacto em Números</h2>
                    <p>Gráfico gerado dinamicamente com a API HTML5 Canvas e JavaScript:</p>
                </div>
                <div class="canvas-wrapper">
                    <canvas id="graficoResgates" width="700" height="240" aria-label="Gráfico de resgates e adoções da ONG">
                        Seu navegador não suporta a tecnologia Canvas.
                    </canvas>
                </div>
                <div class="legenda-canvas">
                    <span class="item-legenda"><span class="cor-bloco cor-resgatados"></span> Resgates Realizados</span>
                    <span class="item-legenda"><span class="cor-bloco cor-adotados"></span> Adoções Concluídas</span>
                    <span class="item-legenda"><span class="cor-bloco cor-voluntarios"></span> Voluntários Ativos: <strong>${cadastros.length + 18}</strong></span>
                </div>
            </section>

            <!-- ANIMAIS PARA ADOÇÃO -->
            <section class="secao-animais">
                <div class="cabecalho-secao">
                    <h2>Amigos Aguardando um Lar</h2>
                    <p>Conheça alguns dos cãezinhos resgatados que estão prontos para receber o seu carinho.</p>
                </div>
                <div class="grid cards">
                    ${cardsAnimaisHTML}
                </div>
            </section>

            <!-- COMO VOCÊ PODE AJUDAR -->
            <section class="secao-ajuda">
                <div class="cabecalho-secao">
                    <h2>Como Fazer a Diferença</h2>
                    <p>Escolha a maneira que melhor se adapta à sua rotina e apoie nossa missão diária.</p>
                </div>

                <div class="grid cards">
                    <article class="card col-4">
                        <div class="icone-card">🤝</div>
                        <h3>Seja Voluntário</h3>
                        <p>Participe dos cuidados diários, banhos, passeios e feiras de adoção presenciais.</p>
                        <a href="#/cadastro?ajuda=voluntario" class="botao" data-rota>Quero Ser Voluntário</a>
                    </article>

                    <article class="card col-4">
                        <div class="icone-card">🍲</div>
                        <h3>Doe Alimentos & Remédios</h3>
                        <p>Nossos cães consomem mais de 500kg de ração por mês, além de vermífugos e vacinas.</p>
                        <a href="#/projetos#doacoes" class="botao" data-rota>Ver Formas de Doação</a>
                    </article>

                    <article class="card col-4">
                        <div class="icone-card">🏡</div>
                        <h3>Ofereça Lar Temporário</h3>
                        <p>Acolha um animal em fase de recuperação enquanto ele aguarda a família definitiva.</p>
                        <a href="#/cadastro?ajuda=lar-temporario" class="botao" data-rota>Oferecer Acolhimento</a>
                    </article>
                </div>
            </section>
        `;
    }

    /**
     * Template da Página de Projetos
     */
    function projetos() {
        return `
            <section class="cabecalho-pagina">
                <h2>Nossos Projetos Sociais</h2>
                <p>
                    A atuação da ONG Cão Sem Dono é estruturada em programas contínuos que garantem a dignidade,
                    saúde e integração dos animais na sociedade.
                </p>
            </section>

            <div class="lista-projetos">
                <article class="card-projeto" id="resgate">
                    <div class="projeto-tag">Ação Emergencial</div>
                    <h3>Projeto Resgate Imediato</h3>
                    <p>
                        Equipe dedicada a prestar socorro a cães vítimas de abandono extremo, acidentes e maus-tratos.
                        Após a triagem, cada animal é encaminhado para internação veterinária, exames laboratoriais,
                        castração e vacinação completa.
                    </p>
                    <h4>Etapas do Cuidado:</h4>
                    <ul class="lista-check">
                        <li>Atendimento médico-veterinário e estabilização de saúde;</li>
                        <li>Vacinação polivalente (V10) e antirrábica;</li>
                        <li>Tratamento de dermatites, carrapatos e microchipagem;</li>
                        <li>Castração obrigatória para controle populacional.</li>
                    </ul>
                </article>

                <article class="card-projeto" id="voluntariado">
                    <div class="projeto-tag">Comunidade</div>
                    <h3>Rede de Voluntariado Cão Sem Dono</h3>
                    <p>
                        O coração da nossa ONG são as pessoas. Voluntários participam de atividades recreativas com os
                        cães, fotografia para divulgação, campanhas de conscientização escolar e suporte operacional.
                    </p>
                    <a href="#/cadastro?ajuda=voluntario" class="botao" data-rota>Cadastrar-se como Voluntário</a>
                </article>

                <article class="card-projeto" id="doacoes">
                    <div class="projeto-tag">Sustentabilidade</div>
                    <h3>Programa Doação Solidária</h3>
                    <p>
                        Não recebemos verba governamental fixa e dependemos 100% da solidariedade de pessoas físicas e empresas parceiras.
                    </p>
                    <div class="bloco-pix">
                        <h4>Contribuição via Chave PIX:</h4>
                        <div class="chave-pix">
                            <code>doacoes@caosemdono.org</code>
                        </div>
                        <p class="pix-info">Banco: Solidariedade Animal | Favorecido: Associação Cão Sem Dono</p>
                    </div>
                </article>

                <article class="card-projeto" id="lar-temporario">
                    <div class="projeto-tag">Acolhimento</div>
                    <h3>Lar Temporário com Afeto</h3>
                    <p>
                        Hospedar temporariamente um animal resgatado reduz drasticamente os níveis de estresse e
                        prepara o cãozinho para conviver harmoniosamente em seu lar permanente. A ONG fornece a ração e
                        o acompanhamento veterinário durante todo o período.
                    </p>
                    <a href="#/cadastro?ajuda=lar-temporario" class="botao" data-rota>Quero Oferecer Lar Temporário</a>
                </article>
            </div>

            <!-- SEÇÃO INTERATIVA: FAQ com HTML5 <details> e <summary> (Abordado na Apostila) -->
            <section class="secao-faq">
                <div class="cabecalho-secao">
                    <h2>Perguntas Frequentes (FAQ)</h2>
                    <p>Tire suas dúvidas sobre o processo de adoção e voluntariado.</p>
                </div>

                <details class="faq-item">
                    <summary>Quais são os requisitos mínimos para adotar um cão?</summary>
                    <div class="faq-conteudo">
                        <p>
                            Ser maior de 21 anos, apresentar documento oficial com foto (RG/CNH), comprovante de endereço
                            recente e passar por uma breve entrevista para alinhamento sobre posse responsável.
                        </p>
                    </div>
                </details>

                <details class="faq-item">
                    <summary>Existe taxa para adoção de animais resgatados?</summary>
                    <div class="faq-conteudo">
                        <p>
                            Não cobramos nenhuma taxa pela adoção! Todos os animais são entregues castrados, microchipados e vacinados.
                            Contudo, doações espontâneas de qualquer valor são muito bem-vindas para cobrir os resgates seguintes.
                        </p>
                    </div>
                </details>

                <details class="faq-item">
                    <summary>Moro em apartamento, posso adotar?</summary>
                    <div class="faq-conteudo">
                        <p>
                            Sim! Temos cães de diferentes perfis e níveis de energia ideais para apartamentos e espaços compactos.
                            Recomendamos que o imóvel tenha telas de proteção quando aplicável.
                        </p>
                    </div>
                </details>
            </section>
        `;
    }

    /**
     * Template do Formulário de Cadastro e Adoção
     */
    function cadastro(params = {}) {
        const ajudaPadrao = params.ajuda || "voluntario";
        const animalNome = params.animal ? decodeURIComponent(params.animal) : "";

        return `
            <section class="cadastro-container">
                <div class="cabecalho-pagina">
                    <h2>Formulário de Cadastro & Adesão</h2>
                    <p>
                        ${animalNome ? `Você está demonstrando interesse em adotar o(a) <strong>${animalNome}</strong>! ` : ""}
                        Preencha o formulário abaixo. Seus dados são protegidos e salvos com segurança em nossa base local.
                    </p>
                </div>

                <form id="formCadastro" class="formulario-ong" novalidate>
                    <!-- DADOS PESSOAIS -->
                    <fieldset>
                        <legend>1. Informações Pessoais</legend>

                        <div class="campo">
                            <label for="nome">Nome Completo *</label>
                            <input type="text" id="nome" name="nome" required minlength="3" placeholder="Seu nome completo" autocomplete="name" aria-describedby="nome-help">
                            <small id="nome-help" class="help-text">Informe nome e sobrenome.</small>
                        </div>

                        <div class="grid colunas-2">
                            <div class="campo col-6">
                                <label for="cpf">CPF *</label>
                                <input type="text" id="cpf" name="cpf" required placeholder="000.000.000-00" maxlength="14" inputmode="numeric" aria-describedby="cpf-help">
                                <small id="cpf-help" class="help-text">Válido com validação de dígitos verificadores.</small>
                            </div>

                            <div class="campo col-6">
                                <label for="data-nascimento">Data de Nascimento *</label>
                                <input type="date" id="data-nascimento" name="dataNascimento" required max="2010-01-01">
                            </div>
                        </div>

                        <div class="grid colunas-2">
                            <div class="campo col-6">
                                <label for="telefone">Telefone Celular / WhatsApp *</label>
                                <input type="tel" id="telefone" name="telefone" required placeholder="(00) 00000-0000" maxlength="15" autocomplete="tel">
                            </div>

                            <div class="campo col-6">
                                <label for="email">E-mail de Contato *</label>
                                <input type="email" id="email" name="email" required placeholder="seu.email@exemplo.com" autocomplete="email">
                            </div>
                        </div>
                    </fieldset>

                    <!-- ENDEREÇO COM AUTOPREENCHIMENTO VIACEP -->
                    <fieldset>
                        <legend>2. Localização & Endereço (Busca Automática por CEP)</legend>

                        <div class="grid colunas-3">
                            <div class="campo col-4">
                                <label for="cep">CEP *</label>
                                <input type="text" id="cep" name="cep" required placeholder="00000-000" maxlength="9" inputmode="numeric" aria-describedby="cep-help">
                                <small id="cep-help" class="help-text">Ao digitar o CEP, os campos abaixo serão preenchidos via API ViaCEP.</small>
                            </div>

                            <div class="campo col-8">
                                <label for="endereco">Logradouro / Bairro *</label>
                                <input type="text" id="endereco" name="endereco" required placeholder="Rua, Avenida, Número e Bairro">
                            </div>
                        </div>

                        <div class="grid colunas-2">
                            <div class="campo col-6">
                                <label for="cidade">Cidade *</label>
                                <input type="text" id="cidade" name="cidade" required placeholder="Cidade">
                            </div>

                            <div class="campo col-6">
                                <label for="estado">Estado (UF) *</label>
                                <select id="estado" name="estado" required>
                                    <option value="">Selecione o Estado</option>
                                    <option value="SP" selected>São Paulo (SP)</option>
                                    <option value="RJ">Rio de Janeiro (RJ)</option>
                                    <option value="MG">Minas Gerais (MG)</option>
                                    <option value="PR">Paraná (PR)</option>
                                    <option value="SC">Santa Catarina (SC)</option>
                                    <option value="RS">Rio Grande do Sul (RS)</option>
                                    <option value="BA">Bahia (BA)</option>
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    <!-- MODALIDADE DE COLABORAÇÃO -->
                    <fieldset>
                        <legend>3. Como Você Deseja Participar?</legend>
                        <div class="opcoes-ajuda">
                            <label class="opcao-radio">
                                <input type="radio" name="ajuda" value="voluntario" ${ajudaPadrao === "voluntario" ? "checked" : ""}>
                                <span><strong>Quero ser voluntário(a)</strong> — auxiliar em resgates, passeios e eventos</span>
                            </label>
                            <label class="opcao-radio">
                                <input type="radio" name="ajuda" value="adocao" ${ajudaPadrao === "adocao" ? "checked" : ""}>
                                <span><strong>Quero adotar um cão</strong> — dar um lar amoroso e responsável</span>
                            </label>
                            <label class="opcao-radio">
                                <input type="radio" name="ajuda" value="lar-temporario" ${ajudaPadrao === "lar-temporario" ? "checked" : ""}>
                                <span><strong>Quero oferecer lar temporário</strong> — acolhimento durante recuperação</span>
                            </label>
                            <label class="opcao-radio">
                                <input type="radio" name="ajuda" value="doacao" ${ajudaPadrao === "doacao" ? "checked" : ""}>
                                <span><strong>Quero realizar doações recorrentes</strong> — ração, remédios ou apoio financeiro</span>
                            </label>
                        </div>

                        <div class="campo mt-3">
                            <label for="mensagem">Observações ou Mensagem:</label>
                            <textarea id="mensagem" name="mensagem" rows="4" placeholder="Conte-nos um pouco sobre você, sua casa, ou se tem preferência por algum animal...">${animalNome ? `Tenho interesse especial no cão ${animalNome}.` : ""}</textarea>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>4. Termos e Confirmação</legend>
                        <label class="opcao-checkbox">
                            <input type="checkbox" id="termos" name="termos" required>
                            <span>Declaro que as informações acima são verdadeiras e estou ciente do compromisso com a posse responsável.</span>
                        </label>
                    </fieldset>

                    <div class="acoes-formulario">
                        <button type="submit" class="botao botao-grande">Concluir e Salvar Cadastro</button>
                        <button type="reset" class="botao botao-secundario">Limpar Campos</button>
                    </div>
                </form>
            </section>
        `;
    }

    /**
     * Template da Página de Contato
     */
    function contato() {
        return `
            <section class="cabecalho-pagina">
                <h2>Fale com o Cão Sem Dono</h2>
                <p>Tem dúvidas, sugestões ou quer agendar uma visita ao nosso abrigo? Entre em contato!</p>
            </section>

            <div class="grid colunas-contato">
                <div class="col-6">
                    <div class="card card-info-contato">
                        <h3>Canais de Atendimento</h3>
                        <p>Nossa equipe de voluntários responde mensagens em até 24 horas úteis.</p>

                        <ul class="lista-contato">
                            <li>
                                <strong>📍 Endereço da Sede:</strong><br>
                                Estrada dos Resgates, 450 - Zona Sul, São Paulo - SP
                            </li>
                            <li>
                                <strong>📞 Telefone / WhatsApp:</strong><br>
                                <a href="tel:+5511999999999">(11) 99999-9999</a>
                            </li>
                            <li>
                                <strong>✉️ E-mail Geral:</strong><br>
                                <a href="mailto:contato@caosemdono.org">contato@caosemdono.org</a>
                            </li>
                            <li>
                                <strong>⏰ Horário de Visitas:</strong><br>
                                Sábados e Domingos, das 10h às 16h (mediante agendamento)
                            </li>
                        </ul>

                        <div class="mapa-acessivel">
                            <h4>Localização no Mapa</h4>
                            <div class="mapa-container">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197475141974!2d-46.6565!3d-23.5645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzUyLjIiUyA0NsKwMzknMjMuNCJX!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr" 
                                    width="100%" 
                                    height="200" 
                                    style="border:0; border-radius: 8px;" 
                                    allowfullscreen="" 
                                    loading="lazy" 
                                    title="Mapa da sede do Cão Sem Dono">
                                </iframe>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-6">
                    <form id="formContato" class="card formulario-contato" novalidate>
                        <h3>Envie uma Mensagem</h3>

                        <div class="campo">
                            <label for="contatoNome">Seu Nome *</label>
                            <input type="text" id="contatoNome" name="nome" required minlength="3" placeholder="Como podemos te chamar?">
                        </div>

                        <div class="campo">
                            <label for="contatoEmail">Seu E-mail *</label>
                            <input type="email" id="contatoEmail" name="email" required placeholder="seu.email@exemplo.com">
                        </div>

                        <div class="campo">
                            <label for="contatoAssunto">Assunto</label>
                            <select id="contatoAssunto" name="assunto">
                                <option value="Dúvida Geral">Dúvida Geral</option>
                                <option value="Adoção de Animais">Adoção de Animais</option>
                                <option value="Voluntariado">Voluntariado</option>
                                <option value="Doações e Parcerias">Doações e Parcerias</option>
                                <option value="Reportar Maus-Tratos">Orientações de Resgate</option>
                            </select>
                        </div>

                        <div class="campo">
                            <label for="contatoMensagem">Mensagem *</label>
                            <textarea id="contatoMensagem" name="mensagem" rows="5" required minlength="10" placeholder="Escreva aqui a sua mensagem..."></textarea>
                        </div>

                        <button type="submit" class="botao botao-grande">Enviar Mensagem</button>
                    </form>
                </div>
            </div>
        `;
    }

    /**
     * Template do Painel Gerencial de Cadastros (Exibição e Controle do localStorage)
     * Requisito fundamental da prática:
     * - Utilizar armazenamento local (localStorage) para guardar e recuperar dados;
     * - Manipular elementos da página (DOM) para alterar conteúdo e estilo dinamicamente;
     * - Simular o comportamento de uma aplicação real.
     */
    function painel() {
        const cadastros = StorageService.obterCadastros();

        let linhasTabela = "";
        if (cadastros.length === 0) {
            linhasTabela = `
                <tr>
                    <td colspan="6" class="texto-centro">Nenhum cadastro registrado no momento no localStorage.</td>
                </tr>
            `;
        } else {
            linhasTabela = cadastros.map(c => `
                <tr data-id="${c.id}">
                    <td><strong>${c.nome}</strong></td>
                    <td>${c.telefone || "-"}</td>
                    <td>${c.cidade}/${c.estado}</td>
                    <td><span class="tag-ajuda tag-${c.ajuda}">${c.ajudaTexto || c.ajuda}</span></td>
                    <td>${c.dataRegistro || "-"}</td>
                    <td class="acoes-tabela">
                        <button class="botao-acao botao-excluir" data-acao="excluir" data-id="${c.id}" title="Excluir cadastro" aria-label="Excluir cadastro de ${c.nome}">
                            🗑️ Excluir
                        </button>
                    </td>
                </tr>
            `).join("");
        }

        return `
            <section class="painel-gerencial">
                <div class="cabecalho-pagina">
                    <h2>Painel de Gestão e Cadastros (localStorage)</h2>
                    <p>
                        Visualização dinâmica dos registros persistidos no armazenamento local do navegador.
                        Os dados cadastrados pelo usuário aparecem instantaneamente aqui sem recarregar a tela.
                    </p>
                </div>

                <div class="resumo-cards grid">
                    <div class="card-resumo col-4">
                        <span class="numero-resumo" id="totalCadastros">${cadastros.length}</span>
                        <span class="label-resumo">Cadastros Armazenados</span>
                    </div>
                    <div class="card-resumo col-4">
                        <span class="numero-resumo">${cadastros.filter(c => c.ajuda === "adocao").length}</span>
                        <span class="label-resumo">Interessados em Adoção</span>
                    </div>
                    <div class="card-resumo col-4">
                        <span class="numero-resumo">${cadastros.filter(c => c.ajuda === "voluntario").length}</span>
                        <span class="label-resumo">Voluntários Prontos</span>
                    </div>
                </div>

                <div class="card tabela-wrapper mt-4">
                    <div class="tabela-topo">
                        <h3>Lista de Voluntários e Interessados</h3>
                        <a href="#/cadastro" class="botao" data-rota>+ Novo Cadastro</a>
                    </div>
                    <div class="tabela-responsiva">
                        <table class="tabela-dados" aria-label="Tabela de voluntários e adotantes cadastrados">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Contato</th>
                                    <th>Localidade</th>
                                    <th>Modalidade</th>
                                    <th>Data</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody id="corpoTabelaCadastros">
                                ${linhasTabela}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        `;
    }

    return {
        inicio,
        projetos,
        cadastro,
        contato,
        painel,
        templateCardAnimal,
        templateBadgeStatus
    };
})();
