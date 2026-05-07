/* =================================================
   MEXPLICA - script.js
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // GREETING - condiciona o texto dependendo da hora do dia
    const greetingEl = document.getElementById('greeting');
    if (greetingEl) {
        const hour = new Date().getHours();
        let greeting = 'Boa noite! Qual seria sua dúvida de hoje?';
        if (hour >= 5 && hour < 12)  greeting = 'Bom dia! Qual seria sua dúvida de hoje?';
        else if (hour >= 12 && hour < 18) greeting = 'Boa tarde! Qual seria sua dúvida de hoje?';
        greetingEl.textContent = greeting;
    }

    // TOGGLE DA NAV MOBILE
    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('open');
            }
        });
    }

    // TOGGLE DO BOTAO AUMENTAR TEXTO - 3 niveis progressivos
    const fontBtn = document.getElementById('toggleFontSize');
    if (fontBtn) {

        document.body.style.transition = 'font-size 0.25s ease';

        let nivelFonte = 0;

        const estadosFonte = [
            { label: 'DIMINUIR TEXTO', fontSize: '',      lineHeight: '',     letterSpacing: '',       wordSpacing: ''       },
            { label: 'AUMENTAR TEXTO',    fontSize: '19px',  lineHeight: '1.85', letterSpacing: '0.02em', wordSpacing: '0.08em' },
            { label: 'TEXTO MAIOR', fontSize: '22px',  lineHeight: '2.05', letterSpacing: '0.03em', wordSpacing: '0.12em' }
        ];

        const iconeAa = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><text x="1" y="18" font-size="16" fill="#ffffff" font-family="sans-serif" font-weight="900">Aa</text></svg>`;

        function aplicarNivelFonte(n) {
            const estado = estadosFonte[n];
            document.body.style.fontSize      = estado.fontSize;
            document.body.style.lineHeight    = estado.lineHeight;
            document.body.style.letterSpacing = estado.letterSpacing;
            document.body.style.wordSpacing   = estado.wordSpacing;

            const proximo = (n + 1) % estadosFonte.length;
            fontBtn.innerHTML = iconeAa + ' ' + estadosFonte[proximo].label;

            if (n === 0) {
                fontBtn.style.outline   = '';
                fontBtn.style.boxShadow = '';
            } else {
                fontBtn.style.outline   = '2px solid rgba(255,255,255,0.6)';
                fontBtn.style.boxShadow = '0 0 0 4px rgba(255,255,255,0.15)';
            }
        }

        fontBtn.addEventListener('click', () => {
            nivelFonte = (nivelFonte + 1) % estadosFonte.length;
            aplicarNivelFonte(nivelFonte);
        });

        fontBtn.innerHTML = iconeAa + ' ' + estadosFonte[1].label;
    }

    // BOTAO ACESSIBILIDADE - abre menu dropdown com opcoes de tema
    const accBtn = document.getElementById('toggleAccessibility');
    if (accBtn) {

        // temas disponiveis
        const temas = [
            { label: 'Modo Claro',       classe: ''           },
            { label: 'Modo Escuro',      classe: 'dark-blue'  },
            { label: 'Modo Mais Escuro', classe: 'dark-black' }
        ];

        let temaAtivo = 0; // indice do tema atual, começa no claro

        // cria o menu dropdown e bota no DOM logo apos o botao
        const menu = document.createElement('div');
        menu.id = 'acc-menu';
        menu.style.cssText = `
            display: none;
            position: absolute;
            top: calc(100% + 8px);
            left: 0;
            min-width: 100%;
            background: #ffffff;
            border: 1.5px solid #e0e0e0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
            z-index: 200;
        `;

        // garante que o botao pai tenha position relative para o menu se ancorar nele
        accBtn.style.position = 'relative';

        // cria um item de menu para cada tema
        temas.forEach((tema, i) => {
            const item = document.createElement('button');
            item.dataset.index = i;
            item.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                width: 100%;
                padding: 11px 16px;
                background: none;
                border: none;
                font-family: 'Inter', sans-serif;
                font-size: 13px;
                font-weight: 600;
                color: #111111;
                cursor: pointer;
                text-align: left;
                transition: background 0.15s;
                white-space: nowrap;
            `;

            // bolinha indicadora (acende quando o tema esta ativo)
            const bolinha = document.createElement('span');
            bolinha.dataset.bolinha = i;
            bolinha.style.cssText = `
                width: 8px;
                height: 8px;
                border-radius: 50%;
                border: 2px solid #cccccc;
                flex-shrink: 0;
                transition: background 0.15s, border-color 0.15s;
            `;

            const texto = document.createElement('span');
            texto.textContent = tema.label;

            item.appendChild(bolinha);
            item.appendChild(texto);

            item.addEventListener('mouseenter', () => {
                item.style.background = '#f5f5f5';
            });
            item.addEventListener('mouseleave', () => {
                item.style.background = 'none';
            });

            // ao clicar no item, aplica o tema e fecha o menu
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                aplicarTema(i);
                fecharMenu();
            });

            menu.appendChild(item);
        });

        // insere o menu como filho do proprio botao para herdar o position:relative
        accBtn.appendChild(menu);

        // aplica o tema: remove todas as classes de dark e adiciona a correta
        function aplicarTema(index) {
            temaAtivo = index;

            document.body.classList.remove('dark-blue', 'dark-black');
            if (temas[index].classe) {
                document.body.classList.add(temas[index].classe);
            }

            // salva
            localStorage.setItem('temaAtivo', index);

            // atualiza as bolinhas: acende a do tema ativo, apaga as outras
            temas.forEach((_, i) => {
                const bolinha = menu.querySelector(`[data-bolinha="${i}"]`);
                if (!bolinha) return;
                if (i === temaAtivo) {
                    bolinha.style.background    = '#7B6EF6';
                    bolinha.style.borderColor   = '#7B6EF6';
                } else {
                    bolinha.style.background    = 'transparent';
                    bolinha.style.borderColor   = '#cccccc';
                }
            });
        }

        function abrirMenu() {
            menu.style.display = 'block';
            // adapta as cores do menu ao tema escuro atual
            const isDark = document.body.classList.contains('dark-blue') || document.body.classList.contains('dark-black');
            const isBlack = document.body.classList.contains('dark-black');
            menu.style.background   = isBlack ? '#111111' : isDark ? '#1a2535' : '#ffffff';
            menu.style.borderColor  = isBlack ? '#333333' : isDark ? '#2a3f52' : '#e0e0e0';

            // ajusta cor do texto dos itens conforme o tema
            menu.querySelectorAll('button').forEach(btn => {
                btn.style.color = isDark || isBlack ? '#e8e8e8' : '#111111';
                btn.addEventListener('mouseenter', () => {
                    btn.style.background = isBlack ? '#222222' : isDark ? '#2a3f52' : '#f5f5f5';
                }, { once: false });
                btn.addEventListener('mouseleave', () => {
                    btn.style.background = 'none';
                });
            });

            // aplica o estado correto das bolinhas ao abrir
            aplicarTema(temaAtivo);
        }

        function fecharMenu() {
            menu.style.display = 'none';
        }

        // clique no botao: abre ou fecha o menu
        accBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const estaAberto = menu.style.display === 'block';
            if (estaAberto) {
                fecharMenu();
            } else {
                abrirMenu();
            }
        });

        // clique fora do menu: fecha
        document.addEventListener('click', () => {
            fecharMenu();
        });

        // estado inicial: bolinha do modo claro acesa
        const temaSalvo = localStorage.getItem('temaAtivo');

        if (temaSalvo !== null) {
            aplicarTema(parseInt(temaSalvo));
        } else {
            aplicarTema(0);
        }
    }

    // STEPS - fluxo de cadastro/login
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const step4 = document.getElementById('step-4');

    function showStep(stepEl) {
        [step1, step2, step3, step4].forEach(s => {
            if (s) s.classList.add('hidden');
        });
        if (stepEl) {
            stepEl.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // STEP 1 - METODO DE CONTATO
    const btnEmail  = document.getElementById('btnEmail');
    const btnPhone  = document.getElementById('btnPhone');
    const mainInput = document.getElementById('mainInput');

    if (btnEmail && btnPhone && mainInput) {
        btnEmail.addEventListener('click', () => {
            btnEmail.classList.add('method-active');
            btnPhone.classList.remove('method-active');
            mainInput.placeholder = 'Insira seu email';
            mainInput.type = 'text';
        });
        btnPhone.addEventListener('click', () => {
            btnPhone.classList.add('method-active');
            btnEmail.classList.remove('method-active');
            mainInput.placeholder = 'Insira seu número de telefone';
            mainInput.type = 'tel';
        });
    }

    // STEP 1 - CONTINUAR
    const continueBtn = document.getElementById('continueBtn');
    const inputError  = document.getElementById('inputError');

    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            const val     = mainInput ? mainInput.value.trim() : '';
            const isPhone = btnPhone && btnPhone.classList.contains('method-active');

            if (!val) {
                if (inputError) inputError.textContent = isPhone
                    ? 'Por favor, insira seu número de telefone.'
                    : 'Por favor, insira seu email.';
                if (mainInput) mainInput.focus();
                return;
            }

            if (!isPhone) {
                const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
                if (!emailOK) {
                    if (inputError) inputError.textContent = 'Email inválido. Verifique e tente novamente.';
                    if (mainInput) mainInput.focus();
                    return;
                }
            } else {
                const phoneOK = /^[\d\s()+\-]{8,}$/.test(val);
                if (!phoneOK) {
                    if (inputError) inputError.textContent = 'Número inválido. Verifique e tente novamente.';
                    if (mainInput) mainInput.focus();
                    return;
                }
            }

            if (inputError) inputError.textContent = '';
            showStep(step2);
        });

        if (mainInput) {
            mainInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') continueBtn.click();
            });
        }
    }

    // STEP 2 - VOLTAR
    const backToStep1 = document.getElementById('backToStep1');
    if (backToStep1) {
        backToStep1.addEventListener('click', () => showStep(step1));
    }

    // STEP 2 - CONTINUAR
    const registerBtn   = document.getElementById('registerBtn');
    const registerError = document.getElementById('registerError');

    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            const firstName = document.getElementById('firstName');
            const lastName  = document.getElementById('lastName');
            const age       = document.getElementById('age');
            const gender    = document.getElementById('gender');
            const password  = document.getElementById('password');

            const fields = [firstName, lastName, age, gender, password];
            const empty  = fields.some(f => !f || !f.value.trim());

            if (empty) {
                if (registerError) registerError.textContent = 'Por favor, preencha todos os campos.';
                return;
            }

            const ageVal = parseInt(age.value);
            if (isNaN(ageVal) || ageVal < 10 || ageVal > 120) {
                if (registerError) registerError.textContent = 'Insira uma idade válida.';
                if (age) age.focus();
                return;
            }

            if (password.value.length < 6) {
                if (registerError) registerError.textContent = 'A senha deve ter pelo menos 6 caracteres.';
                if (password) password.focus();
                return;
            }

            if (registerError) registerError.textContent = '';
            showStep(step3);
        });
    }

    // STEP 3 - ESCOLHA DE COLABORADOR
    const yesCollab = document.getElementById('yesCollab');
    const noCollab  = document.getElementById('noCollab');
    if (yesCollab) yesCollab.addEventListener('click', () => showStep(step4));
    if (noCollab)  noCollab.addEventListener('click',  () => showStep(step4));

    // STEP 3 - INFO COLABORADOR
    const collabInfoLink = document.querySelector('.collab-info-link');
    if (collabInfoLink) {
        collabInfoLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Colaboradores são voluntários que ajudam usuários com dúvidas tecnológicas. Você pode responder perguntas, enviar vídeos explicativos, fazer chamadas e subir de nível conforme contribui com a comunidade!');
        });
    }

    // ANIMAÇÃO DE ENTRADA
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.topic-card, .step-card, .legend-item, .contact-card').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.4s ease ${i * 0.07}s, transform 0.4s ease ${i * 0.07}s`;
        observer.observe(el);
    });

});