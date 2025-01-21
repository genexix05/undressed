<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultado Emocional</title>
</head>
<body>
    <form action="recibir3.php" method="post">
        <select name="estado" id="estado">
            <option value=""></option>
            <option value="feliz">Feliz</option>
            <option value="triste">Triste</option>
        </select>
        <input type="submit" value="Enviar">
    </form>
    
    <?php
    if(isset($_POST["estado"])) {
        $estado = $_POST["estado"];
        if ($estado == "feliz") {
            echo "Estás feliz";
            echo "<img src='feliz.png' alt='Felicidad'>";
        } elseif ($estado == "triste") {
            echo "Estás triste";
            echo "<img src='triste.png' alt='Tristeza'>";
        } else {
            echo "No sé cómo estás";
            echo "<img src='error.png' alt='Error'>";
        }
    }
    ?>
</body>
</html>
