<?php
session_start();
include_once 'funciones.php';

// Aplicar estilos seleccionados
if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['perfil'])) {
    aplicaEstilo($_GET);
}

// Destruir sesión y reiniciar estilos
if (isset($_GET['accion']) && $_GET['accion'] == 'destruir') {
    session_destroy();
    header("Location: index.php");
    exit;
}

// Iniciar valores por defecto si no existen
if (!isset($_SESSION['estilos'])) {
    $_SESSION['estilos'] = [
        'normal' => ['color' => '#000000', 'fuente' => 'Arial', 'tamano' => 16],
        'nocturno' => ['color' => '#FFFFFF', 'fuente' => 'Times New Roman', 'tamano' => 16],
        'altoContraste' => ['color' => '#FFD700', 'fuente' => 'Verdana', 'tamano' => 16]
    ];
}

// Aplicar estilos al cargar la página
$estiloActual = isset($_SESSION['perfilActivo']) ? $_SESSION['estilos'][$_SESSION['perfilActivo']] : $_SESSION['estilos']['normal'];
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Personalizador</title>
    <link rel="stylesheet" type="text/css" href="estilos.css">
</head>
<body>
    <h1>Personalizador</h1>

    <!-- Formularios de personalización -->
    <?php foreach (['normal', 'nocturno', 'altoContraste'] as $perfil): ?>
        <form method="GET" action="index.php">
            <fieldset>
                <legend>Perfil <?php echo ucfirst($perfil); ?></legend>
                Color de Fondo: <input type="color" name="color" value="<?php echo $_SESSION['estilos'][$perfil]['color']; ?>"><br>
                Fuente: <select name="fuente">
                    <?php foreach (['Arial', 'Times New Roman', 'Verdana', 'Georgia', 'Courier New'] as $fuente): ?>
                        <option value="<?php echo $fuente; ?>" <?php echo ($_SESSION['estilos'][$perfil]['fuente'] == $fuente) ? 'selected' : ''; ?>>
                            <?php echo $fuente; ?>
                        </option>
                    <?php endforeach; ?>
                </select><br>
                Tamaño de Letra: <input type="range" name="tamano" min="1" max="72" value="<?php echo $_SESSION['estilos'][$perfil]['tamano']; ?>"><br>

                <!-- Zona de previsualización para este perfil -->
                <div id="previsualizacion-<?php echo $perfil; ?>" class="previsualizacion">
                    Texto de muestra
                </div>

                <button type="submit" name="perfil" value="<?php echo $perfil; ?>">Aplicar <?php echo ucfirst($perfil); ?></button>
            </fieldset>
        </form>
    <?php endforeach; ?>

    <!-- Enlace a la segunda página y botón para destruir la sesión -->
    <a href="segunda_pagina.php">Segunda página</a><br>
    <a href="index.php?accion=destruir">Destruir sesión</a>

    <script src="scripts.js"></script>
</body>
</html>