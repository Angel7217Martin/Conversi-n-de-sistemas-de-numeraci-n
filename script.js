const btnConvertir = document.getElementById("btnConvertir");
const selectSistema = document.getElementById("sistema");
const inputNumero = document.getElementById("numero");
const resultadosDiv = document.getElementById("resultados");
const inputGroup = inputNumero.closest('.input-group');

const validaciones = {
    "10": /^[0-9]+$/,
    "2": /^[01]+$/,
    "8": /^[0-7]+$/,
    "16": /^[0-9A-Fa-f]+$/
};

inputNumero.addEventListener('input', validarEntrada);

selectSistema.addEventListener('change', () => {
    validarEntrada();
    if (inputNumero.value.trim() !== '') convertir();
});

function validarEntrada() {
    let sistema = selectSistema.value;
    let numero = inputNumero.value.trim();

    if (numero === '') {
        inputGroup.classList.remove('invalid');
        return true;
    }

    if (!validaciones[sistema].test(numero)) {
        inputGroup.classList.add('invalid');
        return false;
    }
    inputGroup.classList.remove('invalid');
    return true;
}

btnConvertir.addEventListener("click", convertir);
inputNumero.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        convertir();
    }
});

function convertir() {
    let sistema = parseInt(selectSistema.value);
    let numero = inputNumero.value.trim();

    if (numero === '' || !validarEntrada()) {
        resultadosDiv.innerHTML = '<div class="placeholder-text">Número inválido o vacío.</div>';
        return;
    }

    let decimal = parseInt(numero, sistema);
    if (isNaN(decimal)) {
        resultadosDiv.innerHTML = '<div class="placeholder-text">Error al convertir.</div>';
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
                    <button class="copy-btn" onclick="copyToClipboard(this, '${value}')" title="Copiar">&#x2398;</button>
                </div>
            </div>
        `;
    }
    resultadosDiv.innerHTML = html;
}

window.copyToClipboard = (btnElement, text) => {
    navigator.clipboard.writeText(text).then(() => {
        const originalHTML = btnElement.innerHTML;
        btnElement.innerHTML = '&#10003;';
        btnElement.classList.add('copied');
        setTimeout(() => {
            btnElement.innerHTML = originalHTML;
            btnElement.classList.remove('copied');
        }, 1500);
    }).catch(err => console.error('Error al copiar: ', err));
};