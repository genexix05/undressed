<!DOCTYPE html>
<html>
<head>
    <title>Resultado del formulario</title>
</head>
<body>
    <?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $elementos_json = $_POST['elementos_json'];
        $elementos = json_decode($elementos_json);

        echo 'Vector recibido como texto:<div>';
        print_r($elementos);
        echo '</div>';

        echo 'Número de elementos: ' . count($elementos) . '<br>';

        array_shift($elementos);
        array_pop($elementos);

        echo 'Vector con el primer y último elemento eliminado:<div>';
        print_r($elementos);
        echo '</div>';

        echo 'Elementos del vector:<br>';
        foreach ($elementos as $elemento) {
            echo "$elemento<br>";
        }
    } else {
        echo 'Método no permitido';
    }
    ?>
</body>
</html>
