<?php
session_start();

// Vaciar el carrito
$_SESSION['carrito'] = [];
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Vaciar carrito</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            text-align: center;
        }

        h1 {
            color: #333;
        }

        a {
            display: flex;
            margin-top: 20px;
            text-decoration: none;
            padding: 10px;
            background-color: #3498db;
            color: #fff;
            border-radius: 5px;
            width: 100px;
            margin: auto;
            text-aling: center;
        }

        a:hover {
            background-color: #2980b9;
        }
    </style>
</head>

<body>

    <h1>Su carrito se ha vaciado!!</h1>

    <a href="producto1.php">Manzana</a><br>
    <a href="producto2.php">Mora</a><br>
    <a href="vaciar-carrito.php">Vaciar carrito</a>

</body>

</html>