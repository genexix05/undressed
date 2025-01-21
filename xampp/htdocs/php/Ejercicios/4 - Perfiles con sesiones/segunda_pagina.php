<?php
session_start();
$estiloActual = isset($_SESSION['perfilActivo']) ? $_SESSION['estilos'][$_SESSION['perfilActivo']] : ['color' => '#000000', 'fuente' => 'Arial', 'tamano' => 16];
?>

<!DOCTYPE html>
<html>
<head>
    <title>Segunda Página</title>
    <link rel="stylesheet" type="text/css" href="estilos.css">
    <style>
        body {
            background-color: <?php echo $estiloActual['color']; ?>;
            font-family: <?php echo $estiloActual['fuente']; ?>;
            font-size: <?php echo $estiloActual['tamano']; ?>px;
        }
    </style>
</head>
<body>
    <h1>Segunda Página</h1>
    <p>Hola, esto es el texto cambiado</p>
    <a href="index.php">Volver a la página principal</a>
</body>
</html>

