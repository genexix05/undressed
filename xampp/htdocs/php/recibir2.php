<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <?php
    $numero = $_POST["numero"];
    if ($numero >= 18) {
        echo "Tienes $numero y eres mayor de edad, puedes entrar.";
    } else {
        echo "Tienes $numero y eres menor de edad, no puedes entrar.";
    }
    ?>
</body>
</html>