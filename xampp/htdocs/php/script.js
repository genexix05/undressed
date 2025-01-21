// script.js

// Función para cambiar la imagen del producto según el color seleccionado
function cambiarImagen(color, imagenOriginal) {
    // Agrega la lógica para cambiar la imagen según el color
    // Puedes tener imágenes específicas para cada color o modificar la imagen original
    // Aquí asumimos que hay imágenes con el sufijo del color en el nombre del archivo
    var nuevaImagen = imagenOriginal.replace('.jpg', '-' + color.toLowerCase() + '.jpg');

    // Actualiza la fuente de la imagen
    document.getElementById('imagenProducto').src = 'imagenes/' + nuevaImagen;
}

// Función para actualizar el precio según la calidad seleccionada
function actualizarPrecio(quality, precioBase) {
    // Agrega la lógica para actualizar el precio según la calidad
    var factorCalidad = 1.0; // factor por defecto para calidad media

    if (quality === '1') {
        factorCalidad = 0.85; // calidad baja
    } else if (quality === '3') {
        factorCalidad = 1.25; // calidad alta
    }

    // Calcula el nuevo precio y lo muestra
    var nuevoPrecio = (precioBase * factorCalidad).toFixed(2);
    document.getElementById('precioProducto').innerHTML = 'Precio: ' + nuevoPrecio + '€';
}

// Evento de cambio en el input de color
document.getElementsByName('color').forEach(function (radio) {
    radio.addEventListener('change', function () {
        cambiarImagen(this.value, 'producto1.jpg'); // Cambia 'producto1.jpg' por el nombre de la imagen original
    });
});

// Evento de cambio en el input de calidad
var calidadInputs = document.getElementsByName('calidad');

if (calidadInputs.length > 0) {
    calidadInputs[0].addEventListener('input', function () {
        actualizarPrecio(this.value, 10.00); // Cambia 10.00 por el precio base del producto
    });
} else {
    console.error("No se encontró ningún elemento con el nombre 'calidad' en el HTML.");
}

