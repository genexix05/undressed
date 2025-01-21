<?php
$modulos = array("Programación", "Bases de datos", "Desarrollo web en entorno servidor");
$modulo = "Programación";

$clave = array_search($modulo, $modulos);

if ($clave !== false) {
    echo "El módulo '$modulo' se encuentra en la posición $clave";
} else {
    echo "No se encontró el módulo '$modulo'";
}
