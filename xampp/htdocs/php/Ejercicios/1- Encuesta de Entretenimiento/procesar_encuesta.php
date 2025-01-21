<style>
body {
    font-family: Arial, sans-serif;
    background-color: #ffffde;
    text-align: center;
}

h1 {
    color: #333;
}

h2 {
    color: #007bff;
}

p {
    color: #444;
}

ul {
    list-style-type: none;
    padding: 0;
}

li::before {
    content: "\2022";
    /* Utiliza un marcador de viñeta redondo */
    color: #007bff;
    display: inline-block;
    width: 1em;
    margin-left: -1em;
}
</style>


<?php
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $nombre = isset($_GET["nombre"]) ? $_GET["nombre"] : "";
    $edad = isset($_GET["edad"]) ? $_GET["edad"] : "";
    $genero = isset($_GET["genero"]) ? $_GET["genero"] : "";
    $entretenimiento = isset($_GET["entretenimiento"]) ? $_GET["entretenimiento"] : [];
    $favorito = isset($_GET["favorito"]) ? $_GET["favorito"] : "";

    $errores = [];

    if (empty($nombre) || strlen($nombre) < 3) {
        $errores[] = "El nombre debe tener al menos 3 caracteres.";
    }

    if (!is_numeric($edad) || $edad < 1 || $edad > 100) {
        $errores[] = "La edad debe ser un número entre 1 y 100.";
    }

    if (empty($genero)) {
        $errores[] = "Debes seleccionar un género.";
    }

    if (empty($entretenimiento)) {
        $errores[] = "Debes seleccionar al menos un tipo de entretenimiento favorito.";
    }

    if (empty($errores)) {
        echo "<h1>¡Gracias por completar la encuesta, $nombre!</h1>";
        echo "<p>Edad: $edad años</p>";
        echo "<p>Género: $genero</p>";
        echo "<p>Tipo de Entretenimiento Favorito:</p>";
        echo "<ul>";
        foreach ($entretenimiento as $item) {
            echo "<li>$item</li>";
        }
        echo "</ul>";
        if (!empty($favorito)) {
            echo "<p>Película, Serie, Anime o Libro Favorito: $favorito</p>";
        }
    } else {
        echo "<h1>Errores:</h1>";
        echo "<ul>";
        foreach ($errores as $error) {
            echo "<li>$error</li>";
        }
        echo "</ul>";
    }
}
?>
