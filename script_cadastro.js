document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastro-form');
    const input = document.getElementById('campo-principal');
    const errorDisplay = document.getElementById('error-message');
    const btnEmail = document.getElementById('btn-email-mode');
    const btnPhone = document.getElementById('btn-phone-mode');

    let modoAtual = 'email'; // Pode ser 'email' ou 'telefone'

    // Trocar para modo Email
    btnEmail.addEventListener('click', () => {
        modoAtual = 'email';
        input.value = '';
        input.placeholder = 'Insira seu email';
        input.type = 'email';
        errorDisplay.innerText = '';
    });

    // Trocar para modo Telefone
    btnPhone.addEventListener('click', () => {
        modoAtual = 'telefone';
        input.value = '';
        input.placeholder = '(00) 00000-0000';
        input.type = 'text';
        errorDisplay.innerText = '';
    });

    // MÁSCARA DE TELEFONE
    input.addEventListener('input', (e) => {
        if (modoAtual === 'telefone') {
            let v = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número
            v = v.replace(/^(\d{2})(\d)/g, "($1) $2"); // DDD
            v = v.replace(/(\d{5})(\d)/, "$1-$2");    // Hífen
            e.target.value = v;
        }
    });

    // VALIDAÇÃO AO ENVIAR
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Para o envio padrão
        
        const valor = input.value.trim();
        let valido = false;

        if (modoAtual === 'email') {
            // RegEx simples para validar email
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (regexEmail.test(valor)) {
                valido = true;
            } else {
                errorDisplay.innerText = "Por favor, insira um e-mail válido.";
            }
        } else {
            // Validar telefone (mínimo 11 números: DDD + 9 dígitos)
            const telLimpo = valor.replace(/\D/g, "");
            if (telLimpo.length >= 11) {
                valido = true;
            } else {
                errorDisplay.innerText = "Insira o telefone completo com DDD.";
            }
        }

        // Se tudo estiver certo, redireciona
        if (valido) {
            window.location.href = "index.html";
        }
    });
});