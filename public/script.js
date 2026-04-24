/* =================================================
   MEXPLICA - script.js
   - simplifiquei os comentarios tambem, qualquer coisa explico para os caras dps
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // GREETING - puxa o elemento greeting e condiciona o texto dependendo da hora do dia 
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

    // TOGGLE DO BOTAO AUMENTAR TEXTO  - 3 niveis progressivos
    // nivel 0 = normal | nivel 1 = medio (+20%) | nivel 2 = grande (+40%)
    // cada clique avança um nivel, no terceiro clique volta ao normal
    // alem da fonte, aumenta tambem o line-height e o letter-spacing,
    // que são os fatores que mais ajudam na leitura para baixa visao
    //basicamente, dando funcionalidade ao botao de aumentar texto, mesmo que basica (ainda)
    const fontBtn = document.getElementById('toggleFontSize');
    if (fontBtn) {

        document.body.style.transition = 'font-size 0.25s ease';

        let nivel = 0;

        const estados = [
            {
                label: 'AUMENTAR TEXTO',
                fontSize: '',
                lineHeight: '',
                letterSpacing: '',
                wordSpacing: ''
            },
            {
                label: 'TEXTO MAIOR',
                fontSize: '19px',
                lineHeight: '1.85',
                letterSpacing: '0.02em',
                wordSpacing: '0.08em'
            },
            {
                label: 'DIMINUIR TEXTO',
                fontSize: '22px',
                lineHeight: '2.05',
                letterSpacing: '0.03em',
                wordSpacing: '0.12em'
            }
        ];

        const iconeAa = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><text x="1" y="18" font-size="16" fill="#ffffff" font-family="sans-serif" font-weight="900">Aa</text></svg>`;

        function aplicarNivel(n) {
            const estado = estados[n];

            document.body.style.fontSize     = estado.fontSize;
            document.body.style.lineHeight   = estado.lineHeight;
            document.body.style.letterSpacing = estado.letterSpacing;
            document.body.style.wordSpacing   = estado.wordSpacing;

            // label mostra sempre o que o proximo clique vai fazer
            const proximoNivel = (n + 1) % estados.length;
            fontBtn.innerHTML = iconeAa + ' ' + estados[proximoNivel].label;

            // indicador visual de ativo
            if (n === 0) {
                fontBtn.style.outline    = '';
                fontBtn.style.boxShadow  = '';
            } else {
                fontBtn.style.outline    = '2px solid rgba(255,255,255,0.6)';
                fontBtn.style.boxShadow  = '0 0 0 4px rgba(255,255,255,0.15)';
            }
        }

        fontBtn.addEventListener('click', () => {
            nivel = (nivel + 1) % estados.length;
            aplicarNivel(nivel);
        });

        // estado inicial - botao ja mostra o que o primeiro clique vai fazer
        fontBtn.innerHTML = iconeAa + ' ' + estados[1].label;
    }

    // TOGGLE DO BOTAO ACESSIBILIDADE
    const accBtn = document.getElementById('toggleAccessibility');
    if (accBtn) {
        let contrastOn = false;
        accBtn.addEventListener('click', () => {
            contrastOn = !contrastOn;
            document.body.classList.toggle('high-contrast', contrastOn);

            if (contrastOn) {
                accBtn.style.outline    = '2px solid rgba(255,255,255,0.6)';
                accBtn.style.boxShadow  = '0 0 0 4px rgba(255,255,255,0.15)';
            } else {
                accBtn.style.outline    = '';
                accBtn.style.boxShadow  = '';
            }
        });
    }

    // INPUT DA HOME - scroll suave pro grid ao apertar enter
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    const grid = document.getElementById('topicGrid');
                    if (grid) {
                        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        searchInput.blur();
                    }
                }
            }
        });
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