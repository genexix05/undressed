<?php
$modulos = array("Programación", "Bases de datos", "Desarrollo web en entorno servidor");
$modulo = "Bases de da";

if (in_array($modulo, $modulos)) {
    echo "Existe el módulo de nombre ".$modulo;
} else {
    echo "No existe el módulo de nombre ".$modulo;
}

