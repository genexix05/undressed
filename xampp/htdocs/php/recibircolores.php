<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<?php
        if (isset($_POST['rojo']) && isset($_POST['verde']) && isset($_POST['azul'])) {
            $rojo = $_POST['rojo'];
            $verde = $_POST['verde'];
            $azul = $_POST['azul'];

            $rojo_hex = str_pad(dechex($rojo), 2, "0", STR_PAD_LEFT);
            $verde_hex = str_pad(dechex($verde), 2, "0", STR_PAD_LEFT);
            $azul_hex = str_pad(dechex($azul), 2, "0", STR_PAD_LEFT);

            // $rojo_hex = dechex($rojo);
            // $verde_hex = dechex($verde);
            // $azul_hex = dechex($azul);

            // $rojo_hex = sprintf("%02s", dechex($rojo));
            // $verde_hex = sprintf("%02s", dechex($verde));
            // $azul_hex = sprintf("%02s", dechex($azul));
            
            // $rojo_hex = base_convert($rojo, 10, 16);
            // $verde_hex = base_convert($verde, 10, 16);
            // $azul_hex = base_convert($azul, 10, 16);

            echo "Rojo: $rojo_hex<br>";
            echo "Verde: $verde_hex<br>";
            echo "Azul: $azul_hex<br>";

            $color_hex = "#" . $rojo_hex . $verde_hex . $azul_hex;
            echo "Color: $color_hex";

            echo "<div style='width: 50px; height: 50px; background-color: $color_hex;'></div>";
        } else {
            echo "nada";
        }
    ?>
</body>
</html>