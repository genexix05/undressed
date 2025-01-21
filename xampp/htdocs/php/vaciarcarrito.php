<?php
session_start();

if (isset($_SESSION["carrito"])) {
    // Vaciar el carrito
    unset($_SESSION["carrito"]);
}

header('Location: carrito.php');
?>
<script src="script.js"></script>