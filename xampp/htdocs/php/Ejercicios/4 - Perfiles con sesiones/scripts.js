document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todos los formularios
    const formularios = document.querySelectorAll('form');

    formularios.forEach(formulario => {
        // Evento para manejar la previsualización en tiempo real
        formulario.addEventListener('input', function() {
            const perfil = this.querySelector('button[type="submit"]').value;
            const color = this.querySelector('input[type="color"]').value;
            const fuente = this.querySelector('select[name="fuente"]').value;
            const tamano = this.querySelector('input[type="range"]').value;

            // Actualizar la previsualización de estilos
            const zonaPrevisualizacion = document.getElementById('previsualizacion-' + perfil);
            zonaPrevisualizacion.style.backgroundColor = color;
            zonaPrevisualizacion.style.fontFamily = fuente;
            zonaPrevisualizacion.style.fontSize = tamano + 'px';
        });

        // Evento para validar antes de enviar
        formulario.addEventListener('submit', function(event) {
            const color = this.querySelector('input[type="color"]').value;
            const fuente = this.querySelector('select[name="fuente"]').value;
            const tamano = this.querySelector('input[type="range"]').value;

            // Validar y prevenir el envío si hay errores
            if (!esColorValido(color) || !esFuenteValida(fuente) || !esTamanoValido(tamano)) {
                event.preventDefault();
                alert('Por favor, ingrese valores válidos.');
            }
        });
    });
});

function esColorValido(color) {
    // Validar el formato del color
    return /^#[0-9A-Fa-f]{6}$/.test(color);
}

function esFuenteValida(fuente) {
    // Lista de fuentes válidas
    const fuentesValidas = ['Arial', 'Times New Roman', 'Verdana', 'Georgia', 'Courier New'];
    return fuentesValidas.includes(fuente);
}

function esTamanoValido(tamano) {
    // Validar rango de tamaño
    return tamano >= 1 && tamano <= 72;
}
