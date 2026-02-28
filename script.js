const btnConvertir = document.getElementById("btnConvertir");
const selectSistema = document.getElementById("sistema");
const inputNumero = document.getElementById("numero");
const resultadosDiv = document.getElementById("resultados");
const errorMsg = document.getElementById("error-msg");
const inputGroup = inputNumero.closest('.input-group');

const validaciones = {
    "10": /^[0-9]+$/,
    "2": /^[01]+$/,
    "8": /^[0-7]+$/,
    "16": /^[0-9A-Fa-f]+$/
};

inputNumero.addEventListener('input', () => {
    validarEntrada();
});

selectSistema.addEventListener('change', () => {
    validarEntrada();
    if (inputNumero.value.trim() !== '') {
        convertir();
    }
});

function validarEntrada() {
    let sistema = selectSistema.value;
    let numero = inputNumero.value.trim();

    if (numero === '') {
        inputGroup.classList.remove('invalid');
        return true;
    }

    let regex = validaciones[sistema];
    if (!regex.test(numero)) {
        inputGroup.classList.add('invalid');
        return false;
    } else {
        inputGroup.classList.remove('invalid');
        return true;
    }
}

btnConvertir.addEventListener("click", convertir);

inputNumero.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        convertir();
    }
});

function convertir() {
    let sistema = parseInt(selectSistema.value);
    let numero = inputNumero.value.trim();

    if (numero === '') {
        resultadosDiv.innerHTML = '<div class="placeholder-text">Por favor ingrese un número.</div>';
        return;
    }

    if (!validarEntrada()) {
        resultadosDiv.innerHTML = '<div class="placeholder-text" style="color: var(--error)">El número ingresado no es válido para la base seleccionada.</div>';
        return;
    }

    let decimal = parseInt(numero, sistema);

    if (isNaN(decimal)) {
        resultadosDiv.innerHTML = '<div class="placeholder-text" style="color: var(--error)">Error inesperado al convertir.</div>';
        return;
    }

    let resultados = {
        "Decimal (Base 10)": decimal.toString(10),
        "Binario (Base 2)": decimal.toString(2),
        "Octal (Base 8)": decimal.toString(8),
        "Hexadecimal (Base 16)": decimal.toString(16).toUpperCase()
    };

    renderResultados(resultados);
}

function renderResultados(resultados) {
    let html = '';

    for (const [label, value] of Object.entries(resultados)) {
        html += `
            <div class="result-item">
                <span class="result-label">${label}</span>
                <div class="result-value-container">
                    <span class="result-value">${value}</span>
                    <button class="copy-btn" onclick="copyToClipboard(this, '${value}')" title="Copiar">
                        <svg xmlns="http://www.w3.org/http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                </div>
            </div>
        `;
    }

    resultadosDiv.innerHTML = html;
}

window.copyToClipboard = function (btnElement, text) {
    navigator.clipboard.writeText(text).then(() => {
        const originalHTML = btnElement.innerHTML;

        btnElement.innerHTML = '<svg xmlns="http://www.w3.org/http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        btnElement.classList.add('copied');

        setTimeout(() => {
            btnElement.innerHTML = originalHTML;
            btnElement.classList.remove('copied');
        }, 1500);
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
};