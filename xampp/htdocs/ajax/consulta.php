<?php
$nombre = 'ajaxajax';
$servidor = 'localhost';
$usuario = 'root';
$clave = '';
$conexion = new mysqli($servidor, $usuario, $clave, $nombre);
if ($conexion->connect_error) {
    die('Error de Conexión (' . $conexion->connect_errno . ') '
            . $conexion->connect_error);
}
$consulta = "SELECT * FROM provincias";
$resultado = $conexion->query($consulta);
while ($fila = $resultado->fetch_assoc()) {
    echo '<option style="color:blue;" value="' . $fila['id'] . '">' . $fila['nombre'] . '</option>';
}
$conexion->close();
?>