<?php

// Modificar un elemento existente
$modulos = array("Programación", "Bases de datos", "Desarrollo web en entorno servidor");
$modulos[0] = "Programación Avanzada";
echo "Array modificado: ";
print_r($modulos);

// Añadir un nuevo elemento sin especificar índice
$modulos[] = "Seguridad informática";
echo "Nuevo elemento añadido: ";
print_r($modulos);

// Eliminar un elemento
unset($modulos[1]);  // Elimina "Bases de datos"
echo "Elemento eliminado: ";
print_r($modulos);


?>