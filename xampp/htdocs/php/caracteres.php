<!DOCTYPE html>
<html>
<head>
    <title>Formulario de Texto</title>
    <style>
        input[type=textarea]
{
  resize: none;
  min-height: 20px;
  form-sizing: content;
}
    </style>
</head>
<body>    
    <form method="post">
    <label for="texto">Texto:</label>
        <textarea name="texto"></textarea><br>
        
        <label for="buscar">Buscar:</label>
        <input type="text" name="buscar"><br>
        
        <label for="reemplazar">Reemplazar por:</label>
        <input type="text" name="reemplazar"><br>
        
        <input type="submit" value="Procesar">
    </form>

    <?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $texto = $_POST['texto'];
        $buscar = $_POST['buscar'];
        $reemplazar = $_POST['reemplazar'];

        $caracteres = strlen($texto);
        $palabras = str_word_count($texto);
        $veces = substr_count($texto, $buscar);

        if ($veces > 0) {
            $texto_reemplazado = str_replace($buscar, $reemplazar, $texto);
            echo "Caracteres: $caracteres<br>";
            echo "Palabras: $palabras<br>";
            echo "La palabra '$buscar' se encuentra en el texto $veces veces<br>";
            echo "Texto con reemplazo: $texto_reemplazado";
        } else {
            echo "Caracteres: $caracteres<br>";
            echo "Palabras: $palabras<br>";
            echo "La palabra '$buscar' no se encuentra en el texto";
        }
    }
    ?>
</body>
</html>
