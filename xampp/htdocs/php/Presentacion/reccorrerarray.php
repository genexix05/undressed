<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recepción de Datos</title>
</head>

<body>
    <?php
    
    $modulos = array("PR" => "Programación", "BD" => "Bases de datos", "DWES" => "Desarrollo web en entorno servidor");
    foreach ($modulos as $codigo => $modulo) {
        echo "El código del módulo " . $modulo . " es " . $codigo . "<br />";
    }
    ?>
</body>
</html>