<?php
$elementovector = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $elementonuevo = $_POST["elementonuevo"];

    $vectorjson = $_POST["elementovector"];
    $elementovector = json_decode($vectorjson);
    $elementovector[] = $elementonuevo;

    $vectorjson = json_encode($elementovector);
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulario</title>
</head>
<body>
    <h2>Formulario</h2>

    <form method="post">
        <label for="elementonuevo">Nuevo Element</label>
        <input type="text" name="elementonuevo" required>
        <input type="hidden" name="elementovector" value="<?php echo htmlspecialchars(json_encode($elementovector)); ?>">
        <button type="submit">Añadir Elemento</button>
    </form>

    <?php
    if (isset($vectorjson)) {
        echo "<h3>Resultado:</h3>";
        echo "<p>Elemento Recibido: $elementonuevo</p>";
        echo "<p>Vector Recibido: $vectorjson</p>";

        echo "<h3>Elementos del Vector:</h3>";
        foreach ($elementovector as $elemento) {
            echo "<div>$elemento</div>";
        }
    }
    ?>
</body>
</html>
