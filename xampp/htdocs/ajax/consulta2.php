<?php
$nombre = 'ajaxajax';
$servidor = 'localhost';
$usuario = 'root';
$clave = '';
$conexion = new mysqli($servidor, $usuario, $clave, $nombre);

$idprovincia = $_GET['Id'];

if ($conexion->connect_error) {
    die('Error de Conexión (' . $conexion->connect_errno . ') '
            . $conexion->connect_error);
}
$consulta = "SELECT * FROM pueblos WHERE provincia_id = $idprovincia";
$resultado = $conexion->query($consulta);
while ($fila = $resultado->fetch_assoc()) {
    echo $fila ['nombre'] . '<br>';
}
$conexion->close();
?>