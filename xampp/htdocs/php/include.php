<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Formulario de una sola página</title>
</head>
<body>
    <?php
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            if (isset($_POST['nombres'])) {
                $nombresJSON = $_POST['nombres'];
                $nombresArray = json_decode($nombresJSON);
                sort($nombresArray);

                echo "<h2>Nombres Ordenados:</h2>";
                echo "<ul>";
                foreach ($nombresArray as $nombre) {
                    echo "<li>$nombre</li>";
                }
                echo "</ul>";
            }
        }
    ?>

    <form action="#" method="post">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required>
        <button type="button" onclick="agregarNombre()">Añadir Nombre</button>
        <h2>Nombres Agregados:</h2>
        <div id="lista-nombres"></div>
        <input type="hidden" id="nombres" name="nombres">
    </form>
    <script>
        let nombres = []; 
        function agregarNombre() {
            let nombre = document.getElementById('nombre').value;
            nombres.push(nombre);
            document.getElementById('nombre').value = '';
            actualizarLista();
        }

        function actualizarLista() {
            document.getElementById('lista-nombres').innerHTML = nombres.join('<br>');
            document.getElementById('nombres').value = JSON.stringify(nombres);
        }
        </script>
</body>
</html>
