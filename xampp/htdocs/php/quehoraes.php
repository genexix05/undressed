<!DOCTYPE html>
<html>
<head>
    <title>Resultado</title>
</head>
<body>
    <h1>Resultado</h1>
    <?php
    if (isset($_POST['fecha'])) {
        $fechaSeleccionada = $_POST['fecha'];
        $fechaActual = date('Y-m-d');
        
        $diasPasados = (strtotime($fechaActual) - strtotime($fechaSeleccionada)) / (24*60*60);
        
        echo "La fecha seleccionada es: $fechaSeleccionada<br>";
        echo "La fecha actual es: $fechaActual<br>";
        echo "Han pasado $diasPasados dias";
    } else {
        echo "otra";
    }
    ?>
</body>
</html>
