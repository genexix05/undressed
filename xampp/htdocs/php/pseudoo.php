<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Formulario de Elementos</title>
</head>

<body>

    <?php
        $elemento = "";
    $vector = [];
    $indiceBorrar = null;

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $vector_json = $_POST['vector'];
        $indiceBorrar = $_POST['indice_borrar'];

        $vector = json_decode($vector_json, true);

        if ($indiceBorrar !== "" && is_numeric($indiceBorrar)) {
            unset($vector[$indiceBorrar]);
            $vector = array_values($vector); // Reindexar el array
        }
    }
    ?>

    <form action="" method="post" id="miFormulario">
        <label for="elemento">Elemento:</label>
        <input type="text" name="elemento" id="elemento">

        <input type="hidden" name="vector" id="vector" value="<?php echo htmlspecialchars(json_encode($vector)); ?>">
        <input type="hidden" name="indice_borrar" id="indice_borrar">

        <button type="button" onclick="agregarElemento()">Añadir Elemento</button>
        <button type="submit">Enviar</button>
    </form>

    <ol>
        <?php
        foreach ($vector as $indice => $valor) {
            echo "<li>$valor <button type='button' onclick='borrarElemento($indice)'>Borrar</button></li>";
        }
        ?>
    </ol>

    <script>
        function agregarElemento() {
            var elemento = document.getElementById("elemento").value;
            var vector = JSON.parse(document.getElementById("vector").value || '[]');
            vector.push(elemento);
            document.getElementById("vector").value = JSON.stringify(vector);
        }

        function borrarElemento(indice) {
            document.getElementById("indice_borrar").value = indice;
            document.getElementById("miFormulario").submit();
        }
    </script>

</body>

</html>