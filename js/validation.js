/**
 * Módulo de Validação e Formatação (Validation) - Cão Sem Dono
 * Contém regras de validação, aplicação de máscaras dinâmicas e
 * integração com a API pública ViaCEP para preenchimento de endereço.
 * Atende aos requisitos da Experiência Prática e da apostila Modulo-FrontEnd.md:
 * - Validação em tempo real (input e blur) com acessibilidade (aria-invalid);
 * - Máscaras dinâmicas de CPF, CEP e Telefone;
 * - Integração assíncrona com API externa;
 * - Feedback visual instantâneo para o usuário.
 */

const ValidationService = (function () {
    /**
     * Aplica máscara de CPF: 000.000.000-00
     */
    function mascaraCPF(valor) {
        let v = valor.replace(/\D/g, "");
        if (v.length > 11) v = v.substring(0, 11);
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return v;
    }

    /**
     * Aplica máscara de CEP: 00000-000
     */
    function mascaraCEP(valor) {
        let v = valor.replace(/\D/g, "");
        if (v.length > 8) v = v.substring(0, 8);
        v = v.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
        return v;
    }

    /**
     * Aplica máscara de Telefone: (00) 00000-0000 ou (00) 0000-0000
     */
    function mascaraTelefone(valor) {
        let v = valor.replace(/\D/g, "");
        if (v.length > 11) v = v.substring(0, 11);
        if (v.length > 10) {
            v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
        } else if (v.length > 5) {
            v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
        } else if (v.length > 2) {
            v = v.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
        } else {
            v = v.replace(/^(\d*)$/, "($1");
        }
        return v;
    }

    /**
     * Algoritmo de validação de dígitos verificadores de CPF
     */
    function validarCPF(cpf) {
        const str = cpf.replace(/\D/g, "");
        if (str.length !== 11) return false;
        // Evita CPFs conhecidos inválidos com todos os números iguais (ex: 111.111.111-11)
        if (/^(\d)\1{10}$/.test(str)) return false;

        let soma = 0;
        let resto;
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(str.substring(i - 1, i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(str.substring(9, 10))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(str.substring(i - 1, i)) * (12 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(str.substring(10, 11))) return false;

        return true;
    }

    /**
     * Valida formato simples de e-mail
     */
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Consulta CEP via API pública do ViaCEP
     */
    async function consultarCEP(cep) {
        const limpo = cep.replace(/\D/g, "");
        if (limpo.length !== 8) return null;

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
            if (!resposta.ok) throw new Error("Erro na requisição ViaCEP");
            const dados = await resposta.json();
            if (dados.erro) return { erro: true };
            return dados;
        } catch (erro) {
            console.warn("Falha ao consultar ViaCEP:", erro);
            return null;
        }
    }

    /**
     * Exibe ou remove mensagem de erro de validação sob o campo
     */
    function definirErroCampo(input, mensagem) {
        let feedback = input.parentNode.querySelector(".feedback-validacao");
        if (!feedback) {
            feedback = document.createElement("span");
            feedback.className = "feedback-validacao";
            feedback.setAttribute("role", "alert");
            feedback.setAttribute("aria-live", "polite");
            input.parentNode.appendChild(feedback);
        }

        if (mensagem) {
            input.classList.add("campo-invalido");
            input.classList.remove("campo-valido");
            input.setAttribute("aria-invalid", "true");
            feedback.textContent = mensagem;
            feedback.style.display = "block";
        } else {
            input.classList.remove("campo-invalido");
            input.classList.add("campo-valido");
            input.setAttribute("aria-invalid", "false");
            feedback.textContent = "";
            feedback.style.display = "none";
        }
    }

    /**
     * Aplica listeners de máscaras e validação em um elemento de formulário
     */
    function configurarFormulario(form) {
        if (!form) return;

        const inputCpf = form.querySelector("#cpf");
        const inputCep = form.querySelector("#cep");
        const inputTel = form.querySelector("#telefone");
        const inputEmail = form.querySelector("#email");
        const inputNome = form.querySelector("#nome");

        // Máscara de CPF
        if (inputCpf) {
            inputCpf.addEventListener("input", function (e) {
                e.target.value = mascaraCPF(e.target.value);
            });
            inputCpf.addEventListener("blur", function (e) {
                const valor = e.target.value.trim();
                if (valor && !validarCPF(valor)) {
                    definirErroCampo(e.target, "Por favor, digite um CPF válido.");
                } else if (valor) {
                    definirErroCampo(e.target, "");
                }
            });
        }

        // Máscara de CEP e Busca no ViaCEP
        if (inputCep) {
            inputCep.addEventListener("input", function (e) {
                e.target.value = mascaraCEP(e.target.value);
            });
            inputCep.addEventListener("blur", async function (e) {
                const valor = e.target.value.trim();
                const limpo = valor.replace(/\D/g, "");
                if (limpo.length === 8) {
                    definirErroCampo(e.target, "Buscando endereço...");
                    const endereco = await consultarCEP(limpo);
                    if (endereco && !endereco.erro) {
                        definirErroCampo(e.target, "");
                        const campoEndereco = form.querySelector("#endereco");
                        const campoCidade = form.querySelector("#cidade");
                        const campoEstado = form.querySelector("#estado");

                        if (campoEndereco && endereco.logradouro) {
                            campoEndereco.value = `${endereco.logradouro}${endereco.bairro ? " - " + endereco.bairro : ""}`;
                            definirErroCampo(campoEndereco, "");
                        }
                        if (campoCidade && endereco.localidade) {
                            campoCidade.value = endereco.localidade;
                            definirErroCampo(campoCidade, "");
                        }
                        if (campoEstado && endereco.uf) {
                            campoEstado.value = endereco.uf;
                            definirErroCampo(campoEstado, "");
                        }
                    } else if (endereco && endereco.erro) {
                        definirErroCampo(e.target, "CEP não encontrado. Preencha o endereço manualmente.");
                    } else {
                        definirErroCampo(e.target, "");
                    }
                } else if (valor && limpo.length < 8) {
                    definirErroCampo(e.target, "CEP incompleto.");
                } else {
                    definirErroCampo(e.target, "");
                }
            });
        }

        // Máscara de Telefone
        if (inputTel) {
            inputTel.addEventListener("input", function (e) {
                e.target.value = mascaraTelefone(e.target.value);
            });
            inputTel.addEventListener("blur", function (e) {
                const limpo = e.target.value.replace(/\D/g, "");
                if (limpo && limpo.length < 10) {
                    definirErroCampo(e.target, "Telefone incompleto. Digite DDD + número.");
                } else if (limpo) {
                    definirErroCampo(e.target, "");
                }
            });
        }

        // Validação de E-mail
        if (inputEmail) {
            inputEmail.addEventListener("blur", function (e) {
                const valor = e.target.value.trim();
                if (valor && !validarEmail(valor)) {
                    definirErroCampo(e.target, "Por favor, digite um e-mail válido.");
                } else if (valor) {
                    definirErroCampo(e.target, "");
                }
            });
        }

        // Validação de Nome
        if (inputNome) {
            inputNome.addEventListener("blur", function (e) {
                const valor = e.target.value.trim();
                if (valor && valor.length < 3) {
                    definirErroCampo(e.target, "O nome deve conter pelo menos 3 caracteres.");
                } else if (valor) {
                    definirErroCampo(e.target, "");
                }
            });
        }
    }

    return {
        mascaraCPF,
        mascaraCEP,
        mascaraTelefone,
        validarCPF,
        validarEmail,
        consultarCEP,
        definirErroCampo,
        configurarFormulario
    };
})();
