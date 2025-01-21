<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recepción de Datos</title>
</head>

<body>
    <?php
    $notas = array(85, 92, 78, 88, 95);
    echo $notas[0];    // Muestra 85
    echo $notas[1];    // Muestra 92
    echo $notas[2];    // Muestra 78   
    echo $notas[3];    // Muestra 88
    echo $notas[4];    // Muestra 95    

    $modulos2 = array("PR" => "Programación", "BD" => "Bases de datos", "DWES" => "Desarrollo web en entorno servidor");
    echo $modulos2["PR"];    // Muestra "Programación"
    echo $modulos2["BD"];    // Muestra "Bases de datos"
    echo $modulos2["DWES"];  // Muestra "Desarrollo web en entorno servidor"
    ?>
</body>

</html>