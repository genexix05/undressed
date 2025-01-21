$(document).ready(function() {
    // Evento al pasar el ratón sobre la imagen de la provincia
    $('#provincias img').mouseover(function() {
        var provincia = $(this).data('provincia');
        cargarInfo(provincia);
    });
});

function cargarInfo(provincia) {
    // Utilizando jQuery para realizar la solicitud AJAX
    $.ajax({
        url: 'info.json', // Nombre del archivo con la información de las provincias
        dataType: 'json',
        success: function (data) {
            mostrarInfo(data[provincia]);
        },
        error: function () {
            console.log('Error al cargar la información.');
        }
    });
}

function mostrarInfo(info) {
    // Mostrar la información en el div correspondiente
    var infoProvincia = $('#info-provincia');
    infoProvincia.html(`
    <div class="info-contenido">
    <h2>${info.nombre}</h2>
    <p>${info.descripcion}</p>
    </div>`);
}
