<?php
// Inicia la sesión
session_start();

// Destruye todas las variables de sesión
session_unset();

// Destruye la sesión
session_destroy();

// Redirige a la página de inicio o a donde desees después de destruir la sesión
header("Location: index.php");
exit;
?>
