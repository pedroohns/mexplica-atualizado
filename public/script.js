document.addEventListener('DOMContentLoaded', () => {

    // GREETING
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

    // referencias dos dois menus para fechar um quando o outro abre (coloquei isso apenas para evitar um bug que tava acontecendo quando vc deixava os dois menus abertos e trocava entre modo claro/escuro, DA PRA RESOLVER ESSE PROBLEMA, mas como é uma parada basica, entao optei pela soluçao mais preguiçosa)
    let menuFonteEl = null;
    let menuAccEl   = null;

    function fecharTodosMenus() {
        if (menuFonteEl) menuFonteEl.style.display = 'none';
        if (menuAccEl)   menuAccEl.style.display   = 'none';
    }

    // ================================================
    // BOTAO AUMENTAR TEXTO - dropdown com slider arrastavel
    // ================================================
    const fontBtn = document.getElementById('toggleFontSize');
    if (fontBtn) {

        // tamanhos de cada nivel
        const niveis = [
            { label: 'PEQUENO', fontSize: '11px', lineHeight: '1.45', letterSpacing: '-0.1em',        wordSpacing: '-0.1em'       },
            { label: 'MÉDIO',   fontSize: '16px', lineHeight: '1.6',  letterSpacing: '',        wordSpacing: ''       },
            { label: 'GRANDE',  fontSize: '22px', lineHeight: '1.95', letterSpacing: '0.02em',  wordSpacing: '0.1em'  }
        ];

        let nivelAtual = 1;

        const iconeAa   = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><text x="1" y="18" font-size="16" fill="#ffffff" font-family="sans-serif" font-weight="900">Aa</text></svg>`;
        const setaAbaixo = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

        // container do menu
        const menuFonte = document.createElement('div');
        menuFonte.id = 'menu-fonte';
        menuFonteEl = menuFonte;
        menuFonte.style.cssText = `
            display: none;
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            width: 280px;
            border-radius: 14px;
            box-shadow: 0 8px 28px rgba(0,0,0,0.13);
            z-index: 200;
            padding: 20px 20px 16px;
            background: #ffffff;
            border: 1.5px solid #e8e8e8;
            box-sizing: border-box;
        `;

        // linha Aa com tamanhos crescentes
        const linhaAa = document.createElement('div');
        linhaAa.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 14px;
            padding: 0 2px;
        `;

        const tamanhoAa = ['13px', '19px', '26px'];
        niveis.forEach((_, i) => {
            const aa = document.createElement('span');
            aa.dataset.aa = i;
            aa.textContent = 'Aa';
            aa.style.cssText = `
                font-family: 'Inter', sans-serif;
                font-size: ${tamanhoAa[i]};
                font-weight: 700;
                color: ${i === nivelAtual ? '#7B6EF6' : '#bbbbbb'};
                line-height: 1;
                cursor: pointer;
                transition: color 0.18s;
                user-select: none;
            `;
            aa.addEventListener('click', () => aplicarNivel(i));
            linhaAa.appendChild(aa);
        });

        // slider nativo - arrastavel por padrao, estilizado via CSS inline + pseudo-elements no style.css
        const sliderWrap = document.createElement('div');
        sliderWrap.style.cssText = `
            position: relative;
            margin-bottom: 8px;
        `;

        const slider = document.createElement('input');
        slider.type  = 'range';
        slider.min   = '0';
        slider.max   = '2';
        slider.step  = '1';
        slider.value = nivelAtual;
        slider.id    = 'fonte-slider';
        slider.style.cssText = `
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 4px;
            border-radius: 999px;
            background: linear-gradient(to right, #7B6EF6 50%, #e0e0e0 50%);
            outline: none;
            cursor: pointer;
            margin: 0;
            display: block;
        `;

        // thumb do slider via style injetado (nao da pra fazer só com inline, tentei antes de criar o style e nao rolou, provavelmente por serem pseudo-elementos)
        const sliderStyle = document.createElement('style');
        sliderStyle.textContent = `
            #fonte-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #7B6EF6;
                cursor: grab;
                border: 2px solid #ffffff;
                box-shadow: 0 2px 6px rgba(123,110,246,0.4);
                transition: transform 0.15s;
            }
            #fonte-slider::-webkit-slider-thumb:active {
                cursor: grabbing;
                transform: scale(1.2);
            }
            #fonte-slider::-moz-range-thumb {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #7B6EF6;
                cursor: grab;
                border: 2px solid #ffffff;
                box-shadow: 0 2px 6px rgba(123,110,246,0.4);
            }
        `;
        document.head.appendChild(sliderStyle);

        slider.addEventListener('input', () => {
            aplicarNivel(parseInt(slider.value));
        });

        sliderWrap.appendChild(slider);

        // labels PEQUENO / MEDIO / GRANDE
        const labelsWrap = document.createElement('div');
        labelsWrap.style.cssText = `
            display: flex;
            justify-content: space-between;
            padding: 0 2px;
        `;

        niveis.forEach((nivel, i) => {
            const lbl = document.createElement('span');
            lbl.dataset.label = i;
            lbl.textContent   = nivel.label;
            lbl.style.cssText = `
                font-family: 'Inter', sans-serif;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 0.05em;
                color: ${i === nivelAtual ? '#7B6EF6' : '#bbbbbb'};
                cursor: pointer;
                transition: color 0.18s;
                user-select: none;
            `;
            lbl.addEventListener('click', () => aplicarNivel(i));
            labelsWrap.appendChild(lbl);
        });

        menuFonte.appendChild(linhaAa);
        menuFonte.appendChild(sliderWrap);
        menuFonte.appendChild(labelsWrap);

        fontBtn.style.position = 'relative';
        fontBtn.appendChild(menuFonte);

        function atualizarGradienteSlider(n) {
            const pct = ['0%', '50%', '100%'];
            slider.style.background = `linear-gradient(to right, #7B6EF6 ${pct[n]}, #e0e0e0 ${pct[n]})`;
        }

        function atualizarCoresMenu() {
            const isBlack = document.body.classList.contains('dark-black');
            const isDark  = document.body.classList.contains('dark-blue');
            const inativo = (isBlack || isDark) ? '#555555' : '#bbbbbb';

            menuFonte.style.background  = isBlack ? '#111111' : isDark ? '#1a2535' : '#ffffff';
            menuFonte.style.borderColor = isBlack ? '#333333' : isDark ? '#2a3f52' : '#e8e8e8';

            // trilho do slider
            const trilhoCor = (isBlack || isDark) ? '#3a3a4a' : '#e0e0e0';
            const pct = ['0%', '50%', '100%'];
            slider.style.background = `linear-gradient(to right, #7B6EF6 ${pct[nivelAtual]}, ${trilhoCor} ${pct[nivelAtual]})`;

            linhaAa.querySelectorAll('[data-aa]').forEach(el => {
                el.style.color = parseInt(el.dataset.aa) === nivelAtual ? '#7B6EF6' : inativo;
            });
            labelsWrap.querySelectorAll('[data-label]').forEach(el => {
                el.style.color = parseInt(el.dataset.label) === nivelAtual ? '#7B6EF6' : inativo;
            });
        }

        function aplicarNivel(n) {
            nivelAtual    = n;
            slider.value  = n;

            const nivel = niveis[n];
            document.body.style.fontSize      = nivel.fontSize;
            document.body.style.lineHeight    = nivel.lineHeight;
            document.body.style.letterSpacing = nivel.letterSpacing;
            document.body.style.wordSpacing   = nivel.wordSpacing;

            atualizarGradienteSlider(n);
            atualizarCoresMenu();
        }

        fontBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const aberto = menuFonte.style.display === 'block';
            fecharTodosMenus();
            if (!aberto) {
                atualizarCoresMenu();
                menuFonte.style.display = 'block';
            }
        });

        document.addEventListener('click', () => {
            menuFonte.style.display = 'none';
        });

        // estado inicial
        aplicarNivel(1);
        // reescreve o innerHTML do botao e reanexa o menu (que foi removido pelo innerHTML)
        fontBtn.innerHTML = iconeAa + ' AUMENTAR TEXTO ' + setaAbaixo;
        fontBtn.appendChild(menuFonte);
    }

    // ================================================
    // BOTAO ACESSIBILIDADE - dropdown modo claro/escuro (removido modo mais escuro coloquei os icones bonitinhos e descriçoes elaboradas)
    // ================================================
    const accBtn = document.getElementById('toggleAccessibility');
    if (accBtn) {

        const temas = [
            {
                label:  'Modo claro',
                sub:    'Telas claras para melhor visibilidade em locais iluminados',
                classe: '',
                icone:  'icons/solzinho.png'
            },
            {
                label:  'Modo escuro',
                sub:    'Telas escuras para melhor visibilidade em ambientes com pouca luz',
                classe: 'dark-blue',
                icone:  'icons/luazinha.png'
            }
        ];

        const temaSalvo = localStorage.getItem('mexplica-tema');
        let temaAtivo = temaSalvo !== null ? parseInt(temaSalvo) : 0;
        if (temaAtivo > 1) temaAtivo = 0;

        const menuAcc = document.createElement('div');
        menuAcc.id  = 'menu-acc';
        menuAccEl   = menuAcc;
        menuAcc.style.cssText = `
            display: none;
            position: absolute;
            top: calc(100% + 8px);
            left: 0;
            width: 300px;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 8px 28px rgba(0,0,0,0.13);
            z-index: 200;
            background: #ffffff;
            border: 1.5px solid #e8e8e8;
        `;

        accBtn.style.position = 'relative';

        temas.forEach((tema, i) => {
            const item = document.createElement('button');
            item.style.cssText = `
                display: flex;
                align-items: center;
                width: 100%;
                padding: 14px 16px;
                background: none;
                border: none;
                cursor: pointer;
                text-align: left;
                gap: 12px;
                transition: background 0.15s;
                border-bottom: ${i < temas.length - 1 ? '1px solid #f0f0f0' : 'none'};
            `;

            const textos = document.createElement('div');
            textos.style.cssText = `flex: 1; display: flex; flex-direction: column; gap: 3px;`;

            const lbl = document.createElement('span');
            lbl.textContent = tema.label;
            lbl.style.cssText = `
                font-family: 'Inter', sans-serif;
                font-size: 13px;
                font-weight: 700;
                color: #111111;
            `;

            const sub = document.createElement('span');
            sub.textContent = tema.sub;
            sub.style.cssText = `
                font-family: 'Inter', sans-serif;
                font-size: 11px;
                font-weight: 400;
                color: #888888;
                line-height: 1.4;
            `;

            textos.appendChild(lbl);
            textos.appendChild(sub);

            const icone = document.createElement('img');
            icone.src = tema.icone;
            icone.alt = '';
            icone.style.cssText = `width: 26px; height: 26px; object-fit: contain; flex-shrink: 0;`;

            item.appendChild(textos);
            item.appendChild(icone);

            item.addEventListener('mouseenter', () => {
                const isDark  = document.body.classList.contains('dark-blue');
                item.style.background = isDark ? '#223344' : '#f7f7f9';
            });
            item.addEventListener('mouseleave', () => {
                item.style.background = 'none';
            });

            item.addEventListener('click', (e) => {
                e.stopPropagation();
                aplicarTema(i);
                menuAcc.style.display = 'none';
            });

            menuAcc.appendChild(item);
        });

        accBtn.appendChild(menuAcc);

        function aplicarTema(index) {
            temaAtivo = index;
            document.body.classList.remove('dark-blue', 'dark-black');
            if (temas[index].classe) {
                document.body.classList.add(temas[index].classe);
            }
            localStorage.setItem('mexplica-tema', index);

            atualizarEstiloMenuAcc();

            // atualiza tambem o menu de fonte para refletir o novo tema
            if (menuFonteEl) {
                const inativo = document.body.classList.contains('dark-blue') ? '#555555' : '#bbbbbb';
                const fundo   = document.body.classList.contains('dark-blue') ? '#1a2535' : '#ffffff';
                const borda   = document.body.classList.contains('dark-blue') ? '#2a3f52' : '#e8e8e8';
                menuFonteEl.style.background  = fundo;
                menuFonteEl.style.borderColor = borda;
                menuFonteEl.querySelectorAll('[data-aa], [data-label]').forEach(el => {
                    const i = parseInt(el.dataset.aa ?? el.dataset.label);
                    // nivelAtual é acessivel pelo closure do bloco de fonte acima
                });
            }
        }

        function atualizarEstiloMenuAcc() {
            const isDark = document.body.classList.contains('dark-blue');

            menuAcc.style.background  = isDark ? '#1a2535' : '#ffffff';
            menuAcc.style.borderColor = isDark ? '#2a3f52' : '#e8e8e8';

            menuAcc.querySelectorAll('button').forEach((btn, i) => {
                const spans = btn.querySelectorAll('span');
                btn.style.borderBottomColor = isDark ? '#2a3f52' : '#f0f0f0';
                if (spans[0]) spans[0].style.color = isDark ? '#e8e8e8' : '#111111';
                if (spans[1]) spans[1].style.color = isDark ? '#666666' : '#888888';
            });
        }

        accBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const aberto = menuAcc.style.display === 'block';
            fecharTodosMenus();
            if (!aberto) {
                atualizarEstiloMenuAcc();
                menuAcc.style.display = 'block';
            }
        });

        document.addEventListener('click', () => {
            menuAcc.style.display = 'none';
        });

        aplicarTema(temaAtivo);
    }

    // INPUT DA HOME
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

    // STEPS
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
            abrirModalColaborador();
        });
    }

    function abrirModalColaborador() {
        const overlay = document.createElement('div');
        const modal   = document.createElement('div');
        const isBlack = document.body.classList.contains('dark-black');
        const isDark  = document.body.classList.contains('dark-blue');

        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.45);
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            opacity: 0;
            transition: opacity 0.25s ease;
        `;

        modal.style.cssText = `
            background: ${isDark ? '#1a2535' : '#ffffff'};
            border: 1.5px solid ${isDark ? '#2a3f52' : '#e8e8e8'};
            border-radius: 20px;
            padding: 36px 32px 28px;
            max-width: 440px;
            width: 100%;
            box-shadow: 0 16px 48px rgba(0,0,0,0.2);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            transform: translateY(18px) scale(0.97);
            transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease;
            opacity: 0;
        `;

        const logo = document.createElement('img');
        logo.src = 'icons/logo-mexplica.png';
        logo.alt = 'MEXPLICA';
        logo.style.cssText = `width: 64px; height: 64px; object-fit: contain;`;

        const titulo = document.createElement('h2');
        titulo.textContent = 'O que é ser um colaborador?';
        titulo.style.cssText = `
            font-family: 'Nimbus Sans', sans-serif;
            font-size: 20px;
            font-weight: 700;
            color: ${isDark ? '#e8e8e8' : '#111111'};
            text-align: center;
            line-height: 1.3;
        `;

        const texto = document.createElement('p');
        texto.textContent = 'Colaboradores são voluntários que ajudam usuários com dúvidas tecnológicas. Você pode responder perguntas, enviar vídeos explicativos, fazer chamadas e subir de nível conforme contribui com a comunidade!';
        texto.style.cssText = `
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            color: ${isDark ? '#aaaaaa' : '#555555'};
            text-align: center;
            line-height: 1.65;
        `;

        const btnFechar = document.createElement('button');
        btnFechar.textContent = 'Entendi!';
        btnFechar.style.cssText = `
            margin-top: 4px;
            padding: 12px 32px;
            background: #7B6EF6;
            color: #ffffff;
            border: none;
            border-radius: 999px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.18s, transform 0.18s;
        `;

        btnFechar.addEventListener('mouseenter', () => {
            btnFechar.style.background = '#5A50C8';
            btnFechar.style.transform  = 'translateY(-1px)';
        });
        btnFechar.addEventListener('mouseleave', () => {
            btnFechar.style.background = '#7B6EF6';
            btnFechar.style.transform  = 'translateY(0)';
        });

        function fecharModal() {
            overlay.style.opacity = '0';
            modal.style.opacity   = '0';
            modal.style.transform = 'translateY(18px) scale(0.97)';
            setTimeout(() => { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 280);
        }

        btnFechar.addEventListener('click', fecharModal);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) fecharModal(); });

        function onEsc(e) {
            if (e.key === 'Escape') { fecharModal(); document.removeEventListener('keydown', onEsc); }
        }
        document.addEventListener('keydown', onEsc);

        modal.appendChild(logo);
        modal.appendChild(titulo);
        modal.appendChild(texto);
        modal.appendChild(btnFechar);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                overlay.style.opacity = '1';
                modal.style.opacity   = '1';
                modal.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // ANIMAÇAO DE ENTRADA
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