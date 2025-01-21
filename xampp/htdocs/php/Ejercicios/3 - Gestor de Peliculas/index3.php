<?php
// Inicializar el catálogo de películas
$catalogo = [];

// Función para mostrar el catálogo de películas en formato de tabla
function mostrarCatalogo($catalogo)
{
    echo "<table border='1'>";
    echo "<tr><th>Título</th><th>Año</th><th>Género</th><th>Carátula</th><th>Acciones</th></tr>";

    foreach ($catalogo as $pelicula) {
        echo "<tr>";
        echo "<td>{$pelicula['titulo']}</td>";
        echo "<td>{$pelicula['año']}</td>";
        echo "<td>{$pelicula['genero']}</td>";
        echo "<td><img src='{$pelicula['caratula']}' alt='Carátula' style='width:100px; height:150px;'></td>";
        echo "<td><form method='post'><input type='hidden' name='titulo' value='{$pelicula['titulo']}'><input type='submit' name='eliminar' value='Eliminar'></form></td>";
        echo "</tr>";
    }

    echo "</table>";
}

// Procesar el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Agregar película
    if (isset($_POST["agregar"])) {
        $titulo = $_POST["titulo"];
        $año = $_POST["año"];
        $genero = $_POST["genero"];
        $caratula = $_POST["caratula"];

        // Validar datos de entrada
        if (strlen($titulo) > 3 && is_numeric($año) && filter_var($caratula, FILTER_VALIDATE_URL)) {
            // Validar si la película ya existe en el catálogo
            $peliculaExistente = false;
            foreach ($catalogo as $pelicula) {
                if ($pelicula['titulo'] == $titulo) {
                    $peliculaExistente = true;
                    break;
                }
            }

            if (!$peliculaExistente) {
                // Agregar la nueva película al catálogo
                $nuevaPelicula = ['titulo' => $titulo, 'año' => $año, 'genero' => $genero, 'caratula' => $caratula];
                $catalogo[] = $nuevaPelicula;
                echo "<p>Película agregada correctamente.</p>";
            } else {
                echo "<p>La película ya existe en el catálogo.</p>";
            }
        } else {
            echo "<p>Por favor, ingresa datos válidos.</p>";
        }
    }

    // Eliminar película
    if (isset($_POST["eliminar"])) {
        $tituloEliminar = $_POST["titulo"];
        foreach ($catalogo as $key => $pelicula) {
            if ($pelicula['titulo'] == $tituloEliminar) {
                unset($catalogo[$key]);
                echo "<p>Película eliminada correctamente.</p>";
                break;
            }
        }
    }
}

// Mostrar el catálogo
mostrarCatalogo($catalogo);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Catálogo de Películas</title>
</head>
<body>
    <h1>Gestión de Catálogo de Películas</h1>
    <form method="post">
        <label for="titulo">Título:</label>
        <input type="text" name="titulo" required><br>

        <label for="año">Año:</label>
        <input type="number" name="año" required><br>

        <label for="genero">Género:</label>
        <input type="text" name="genero" required><br>

        <label for="caratula">URL de la Carátula:</label>
        <input type="url" name="caratula" required><br>

        <input type="submit" name="agregar" value="Agregar Película">
    </form>

    <form method="post">
        <label for="buscar">Buscar por Título:</label>
        <input type="text" name="buscar" required>
        <input type="submit" value="Buscar">
    </form>
</body>
</html>
