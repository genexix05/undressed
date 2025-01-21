<?php session_start(); ?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carrito</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 20px;
            background-color: #f4f4f4;
        }

        h1 {
            color: #333;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        table, th, td {
            border: 1px solid #ddd;
        }

        th, td {
            padding: 10px;
            text-align: left;
        }

        tr.total-row {
            background-color: #f2f2f2;
            font-weight: bold;
        }

        a {
            text-decoration: none;
            color: #3498db;
        }

        a:hover {
            color: #2980b9;
        }

        .empty-cart-message {
            color: #555;
            font-style: italic;
        }
    </style>
</head>
<body>

    <?php
        if(isset($_REQUEST['cantidad'])){
            $compra = [
                "producto" => $_REQUEST['producto'],
                "cantidad" => $_REQUEST['cantidad'],
                "precio" => $_REQUEST['precio'],
                "imagen" => $_REQUEST['imagen'],
                "color" => isset($_REQUEST['color']) ? $_REQUEST['color'] : '',
                "calidad" => isset($_REQUEST['calidad']) ? $_REQUEST['calidad'] : ''
            ];

            if(!isset($_SESSION["carrito"])){
                $_SESSION["carrito"] = [];
            }

            $encontrado = false;
            for($i = 0; $i < count($_SESSION["carrito"]); $i++){
                if($_SESSION["carrito"][$i]["producto"] == $_REQUEST['producto'] && 
                   (!isset($_REQUEST['color']) || $_SESSION["carrito"][$i]["color"] == $_REQUEST['color']) &&
                   (!isset($_REQUEST['calidad']) || $_SESSION["carrito"][$i]["calidad"] == $_REQUEST['calidad'])){
                    $encontrado = true;
                    $_SESSION["carrito"][$i]["cantidad"] += $_REQUEST['cantidad'];
                }
            }

            if(!$encontrado) array_push($_SESSION["carrito"], $compra);
        }

        echo("<h1>Carrito</h1>");

        if(isset($_SESSION["carrito"]) && !empty($_SESSION["carrito"])) {
            echo("<table align='center'>");
            $precioTotal = 0;
            foreach ($_SESSION["carrito"] as $item) {
                echo("<tr>");
                echo("<td><img src='".$item["imagen"]."' height='50'></td>");
                echo("<td><h2>".$item["producto"]."</h2></td>");
                echo("<td><strong>Precio por unidad:</strong> ".$item["precio"]."€</td>");
                echo("<td><strong>Unidades:</strong> ".$item["cantidad"]."</td>");
                echo("<td><strong>Color:</strong> ".$item["color"]."</td>"); 
                echo("<td><strong>Calidad:</strong> ".$item["calidad"]."</td>");
            
                $totalLinea = $item["cantidad"] * $item["precio"];
                echo("<td><strong>Total por línea:</strong> ".$totalLinea."€</td>");
            
                echo("</tr>");
                $precioTotal += $totalLinea;
            }
            echo("<tr class='total-row'>");

            echo("<td></td>");
            echo("<td><h2>Total</h2></td>");
            echo("<td>&nbsp;</td>");
            echo("<td>&nbsp;</td>");
            echo("<td>&nbsp;</td>");
            echo("<td>&nbsp;</td>");
            echo("<td><strong>Total:</strong> ".$precioTotal."€</td>");
            echo("</tr>");
            echo("</table>");
        } else {
            echo("Carrito vacío");
        }
        
    ?>


    <br><br>
    <a href="producto1.php">Manzana</a><br>
    <a href="producto2.php">Mora</a><br>
    <a href="vaciar-carrito.php">Vaciar carrito</a>
</body>
</html>