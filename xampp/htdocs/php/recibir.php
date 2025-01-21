<!DOCTYPE html>
<html>

<head>
    <title>Procesar Datos</title>
</head>

<body>
    <?php
    $nombre = $_POST["nombre"];
    $apellido = $_POST["apellido"];
    echo "Hola $nombre $apellido, gracias por enviarnos tus datos personales.";
    ?>
</body>

</html>