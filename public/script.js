/* =================================================
   MEXPLICA - script.js
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // GREETING - isso aqui funciona da seguinte forma: a variavel puxa o elemento greeting e nele ta considerado new Date().getHours, que fazem
    // o trabalho de condicionar que tipo de texto vai aparecer dependendo do horario do dia
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

    // TOGGLE DO BOTAO ACESSIBILIDADE
    const fontBtn = document.getElementById('toggleFontSize');
    if (fontBtn) {
        let large = false;
        fontBtn.addEventListener('click', () => {
            large = !large;
            document.body.classList.toggle('font-large', large);
            const svg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><text x="1" y="18" font-size="16" fill="#ffffff" font-family="sans-serif" font-weight="900">Aa</text></svg>`;
            fontBtn.innerHTML = svg + (large ? ' DIMINUIR TEXTO' : ' AUMENTAR TEXTO');
        });
    }

    // provavelmente eu vou remover isso. caso eu tenha paciencia pra fazer DESSA FORMA, eu faço, senao, eu arrumo outro jeito
    const accBtn = document.getElementById('toggleAccessibility');
    if (accBtn) {
        let contrastOn = false;
        accBtn.addEventListener('click', () => {
            contrastOn = !contrastOn;
            document.body.classList.toggle('high-contrast', contrastOn);
        });
    }

    // INPUT DA HOME - aqui tem um event listener que fica escutando o input de busca da home, e quando o usuario aperta enter, ele checa se tem algo escrito, e se tiver, ele da um scroll suave pra grade de topicos. isso é pra facilitar a vida do usuario, que as vezes pode nao perceber que tem uma grade de topicos ali embaixo, e pra incentivar ele a explorar os topicos mesmo que ele tenha uma duvida especifica em mente. se o input estiver vazio, ele nao faz nada, porque nao tem motivo pra levar o usuario pra grade se ele nao ta procurando nada. e o blur() é pra tirar o foco do input depois que o usuario aperta enter, pra evitar que o teclado continue aberto no mobile ou que o cursor fique piscando no input sem necessidade. basicamente, isso é uma pequena melhoria de usabilidade pra tornar a navegação mais fluida e intuitiva.
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

    // STEPS - aqui tem um monte de coisa relacionada aos steps, que é a parte de cadastro/login. basicamente, tem uma função showStep que recebe um elemento de step e mostra ele, escondendo os outros. ai tem os event listeners dos botoes de cada step, que fazem as validações basicas dos inputs e chamam a showStep com o proximo step se tudo estiver ok. tem tambem um link de informacao sobre o que é ser colaborador, que mostra um alert explicando isso. e por fim, tem uma parte de animacao de entrada usando IntersectionObserver, que faz os elementos aparecerem com uma transicao suave quando eles entram na viewport. isso tudo é pra criar uma experiencia de cadastro mais fluida e amigavel pro usuario, com feedbacks claros e animacoes agradaveis.
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

    // STEP 1 METODO DE CONTATO - aqui tem os botoes de escolher entre email e telefone, que adicionam ou removem a classe method-active pra indicar qual metodo ta selecionado, e também mudam o placeholder e o tipo do input principal dependendo da escolha. ai tem o botao de continuar, que faz as validacoes basicas do input: se ta vazio, se é um email valido (se o metodo for email) ou se é um numero valido (se o metodo for telefone). se tiver algum erro, ele mostra uma mensagem de erro e foca no input. se tudo estiver ok, ele limpa a mensagem de erro e mostra o step 2. tambem tem um event listener pro enter no input, que aciona o clique no botao de continuar, pra facilitar a vida do usuario.
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

    // STEP 1 CONTINUAR - aqui tem o event listener do botao de continuar, que faz as validacoes basicas do input: se ta vazio, se é um email valido (se o metodo for email) ou se é um numero valido (se o metodo for telefone). se tiver algum erro, ele mostra uma mensagem de erro e foca no input. se tudo estiver ok, ele limpa a mensagem de erro e mostra o step 2. tambem tem um event listener pro enter no input, que aciona o clique no botao de continuar, pra facilitar a vida do usuario.
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

    // STEP 2 BACK - aqui tem o botao de voltar pro step 1, que simplesmente chama a funcao showStep com o step 1, pra mostrar ele e esconder os outros. isso permite que o usuario volte e mude o metodo de contato ou corrija o input se tiver algum erro.
    const backToStep1 = document.getElementById('backToStep1');
    if (backToStep1) {
        backToStep1.addEventListener('click', () => showStep(step1));
    }

    // STEP 2 CONTINUAR - aqui tem o event listener do botao de continuar, que faz as validacoes basicas dos inputs de cadastro: se ta vazio, se a idade é um numero valido entre 10 e 120, se a senha tem pelo menos 6 caracteres. se tiver algum erro, ele mostra uma mensagem de erro e foca no input correspondente. se tudo estiver ok, ele limpa a mensagem de erro e mostra o step 3. isso garante que o usuario preencha as informacoes basicas de forma correta antes de prosseguir pro passo seguinte.
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

    // STEP 3 - aqui tem os botoes de escolher se quer ser colaborador ou nao, que simplesmente mostram o step 4 quando clicados. isso é porque o step 4 tem as informacoes finais e o botao de concluir cadastro, entao independente da escolha do usuario, ele vai precisar passar por esse passo final pra terminar o processo de cadastro.
    const yesCollab = document.getElementById('yesCollab');
    const noCollab  = document.getElementById('noCollab');
    if (yesCollab) yesCollab.addEventListener('click', () => showStep(step4));
    if (noCollab)  noCollab.addEventListener('click',  () => showStep(step4));

    // STEP 3 INFO - aqui tem um link de informacao sobre o que é ser colaborador, que mostra um alert explicando isso. isso é pra esclarecer as duvidas do usuario sobre o papel do colaborador e incentivar ele a participar da comunidade, mostrando os beneficios e as formas de contribuir.
    const collabInfoLink = document.querySelector('.collab-info-link');
    if (collabInfoLink) {
        collabInfoLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Colaboradores são voluntários que ajudam usuários com dúvidas tecnológicas. Você pode responder perguntas, enviar vídeos explicativos, fazer chamadas e subir de nível conforme contribui com a comunidade!');
        });
    }

    // ANIMAÇÃO DE ENTRADA - aqui tem uma parte de animacao de entrada usando IntersectionObserver, que faz os elementos aparecerem com uma transicao suave quando eles entram na viewport. isso é pra criar uma experiencia visual mais agradável e dinâmica, dando um toque de interatividade e fluidez ao navegar pela pagina. os elementos começam com opacidade 0 e uma leve translação pra baixo, e quando entram na viewport, eles ganham opacidade 1 e voltam pra posição original, criando um efeito de fade-in e slide-up.
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