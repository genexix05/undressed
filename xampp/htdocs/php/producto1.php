<!DOCTYPE html>
<html lang="es">
<style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        table {
            width: 80%;
            margin: auto;
            border-collapse: collapse;
            margin-top: 20px;
        }

        td {
            padding: 20px;
            vertical-align: top;
        }

        h1 {
            color: #333;
        }

        img {
            max-width: 50%;
            height: auto;
        }

        p {
            margin-bottom: 10px;
        }

        form {
            margin-top: 20px;
        }

        .color-selector, .quality-selector {
            margin-bottom: 10px;
        }

        input[type="number"] {
            width: 50px;
        }

        input[type="range"] {
            width: 80%;
        }

        input[type="submit"] {
            padding: 10px;
            background-color: #3498db;
            color: #fff;
            border: none;
            cursor: pointer;
        }

        input[type="submit"]:hover {
            background-color: #2980b9;
        }

        a {
            text-decoration: none;
            color: #3498db;
        }

        a:hover {
            color: #2980b9;
        }
    </style>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <script>
    var images = {
        negro: "https://comedelahuerta.com/wp-content/uploads/2019/09/MANZANA-ROYAL-GALA-ECOLOGICO-COMEDELAHUERTA-1.jpg",
        rojo: "https://comotecuidaunamanzana.eu/wp-content/uploads/elementor/thumbs/VERDE-prstxcbeo0akdr4roylsk3dmmomxbno8bgx0qdrdsw.png",
        gris: "https://www.frutality.es/wp-content/uploads/manzana-amarilla.png"
    };

    function updateProduct() {
        var color = document.querySelector('input[name="color"]:checked').value;
        var calidad = document.querySelector('input[name="calidad"]').value;

        document.getElementById('product-image').src = images[color];

        var precioBase = 1000;

        if (calidad == 1) {
            precioBase -= precioBase * 0.15;
        } else if (calidad == 3) {
            precioBase += precioBase * 0.25;
        }

        // Mostrar el precio actualizado
        document.getElementById('product-price').innerHTML = "Precio: " + precioBase.toFixed(2) + "€";
        document.getElementById('precioBase').value = precioBase.toFixed(2);
    }
    </script>

</head>

<body>
    <table>
        <tr>
            <td>
                <h1>Manzana</h1>
                <p></p>
                <img id="product-image"
                    src="https://comedelahuerta.com/wp-content/uploads/2019/09/MANZANA-ROYAL-GALA-ECOLOGICO-COMEDELAHUERTA-1.jpg"
                    alt="">
                <p id="product-price">Precio: 1000€</p>
            </td>
            <td>
                <br><br><br><br>
                <form action="carrito.php" method="get" oninput="updateProduct()">
                    Cantidad: <input type="number" name="cantidad" min="1" max="3" size="3" value="1">
                    <div class="color-selector">
                        Color:
                        <label><input type="radio" name="color" value="negro" data-image="negro">Roja</label>
                        <label><input type="radio" name="color" value="rojo" data-image="rojo">Verde</label>
                        <label><input type="radio" name="color" value="gris" data-image="gris">Amarilla</label>
                    </div>
                    <div class="quality-selector">
                        Calidad:
                        <input type="range" name="calidad" min="1" max="3" value="2">
                    </div>
                    <br>
                    <input type="submit" value="Comprar!" onclick="return validateStock()">
                    <input type="hidden" value="Manzana" name="producto">
                    <input type="hidden" value="1000" name="precio" id="precioBase">
                    <input type="hidden" value="https://comedelahuerta.com/wp-content/uploads/2019/09/MANZANA-ROYAL-GALA-ECOLOGICO-COMEDELAHUERTA-1.jpg" name="imagen">
                </form>
                <br>
                <a href="producto1.php">Manzana</a><br>
                <a href="producto2.php">Mora</a><br>
                <a href="vaciar-carrito.php">Vaciar carrito</a>
            </td>
        </tr>
    </table>

    <script>
    function validateStock() {
        var color = document.querySelector('input[name="color"]:checked').value;
        var cantidad = parseInt(document.querySelector('input[name="cantidad"]').value);

        if (color in stock && stock[color] + cantidad > 3) {
            alert("No hay suficiente stock disponible para esa cantidad en el color seleccionado.");
            return false;
        }

        return true;
    }
    </script>

    <?php

    function actualizarStock()
    {
        $_SESSION['stock'] = [
            "rojo" => 3,
            "negro" => 3,
            "azul" => 3
        ];
    }

    if (isset($_REQUEST['cantidad']) && isset($_REQUEST['color'])) {
        $color = $_REQUEST['color'];
        $cantidad = $_REQUEST['cantidad'];

        if (!isset($_GET['verCarrito'])) {
            if (isset($_SESSION['stock'][$color]) && $_SESSION['stock'][$color] >= $cantidad) {
                $_SESSION['stock'][$color] -= $cantidad;

                $compra = [
                    "producto" => $_REQUEST['producto'],
                    "cantidad" => $_REQUEST['cantidad'],
                    "precio" => $_REQUEST['precio'],
                    "imagen" => $_REQUEST['imagen'],
                    "color" => $_REQUEST['color'],
                    "calidad" => $_REQUEST['calidad']
                ];

                // Añadir el producto al carrito
                if (!isset($_SESSION["carrito"])) {
                    $_SESSION["carrito"] = [];
                }

                array_push($_SESSION["carrito"], $compra);
            } else {
                echo "<script>alert('No hay suficiente stock disponible para esa cantidad en el color seleccionado.');</script>";
            }
        }
    }

    if (isset($_GET['vaciarCarrito'])) {
        actualizarStock();
        $_SESSION['carrito'] = [];
    }
    ?>
</body>

</html>