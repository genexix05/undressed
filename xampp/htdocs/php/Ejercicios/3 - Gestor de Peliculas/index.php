<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catálogo de películas</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>

<body class="bg-gray-100">

    <div class="container mx-auto p-8">


<?php
// Inicializar el catálogo de películas
$catalogoPeliculas = isset($_POST['catalogoJson']) ? json_decode($_POST['catalogoJson'], true) : [];
$catalogoMostrar = $catalogoPeliculas; // Catálogo que se mostrará en la página

// Lógica para manejar las operaciones del formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $accion = $_POST['accion'] ?? '';

    switch ($accion) {
        case "Agregar":
            // Lógica para agregar película
            $titulo = $_POST['titulo'] ?? '';
            $ano = $_POST['ano'] ?? '';
            $genero = $_POST['genero'] ?? '';
            $caratula = $_POST['caratula'] ?? '';

            agregarPelicula($catalogoPeliculas, $titulo, $ano, $genero, $caratula);
            $catalogoMostrar = $catalogoPeliculas;
            break;

        case "Buscar":
            // Lógica para buscar película
            $tituloBuscar = $_POST['tituloBuscar'] ?? '';
            $catalogoMostrar = buscarPelicula($catalogoPeliculas, $tituloBuscar);
            break;

        case "Eliminar":
            // Lógica para eliminar película
            $tituloEliminar = $_POST['tituloEliminar'] ?? '';
            eliminarPelicula($catalogoPeliculas, $tituloEliminar);
            $catalogoMostrar = $catalogoPeliculas;
            break;
    }
}

function agregarPelicula(&$catalogo, $titulo, $ano, $genero, $caratula)
{
    // Agregar película
    $catalogo[] = ["titulo" => $titulo, "ano" => $ano, "genero" => $genero, "caratula" => $caratula];
}

function buscarPelicula($catalogo, $tituloBuscar)
{
    if (!$tituloBuscar)
        return $catalogo;

    return array_filter($catalogo, function ($pelicula) use ($tituloBuscar) {
        return stripos($pelicula['titulo'], $tituloBuscar) !== false;
    });
}

function eliminarPelicula(&$catalogo, $tituloEliminar)
{
    foreach ($catalogo as $key => $pelicula) {
        if ($pelicula['titulo'] === $tituloEliminar) {
            unset($catalogo[$key]);
            break;
        }
    }
}
?>

<div class="container mx-auto p-8">
    <h1>Agregar peliculas</h1>
        <!-- Formulario para agregar película -->
        <div class="mb-8">
            <form method="post" class="flex space-x-4">
                <input type="text" name="titulo" placeholder="Título" required
                    class="input-field">
                <input type="number" name="ano" placeholder="Año" required
                    class="input-field">
                <input type="text" name="genero" placeholder="Género" required
                    class="input-field">
                <input type="url" name="caratula" placeholder="Carátula" required
                    class="input-field">
                <input type="hidden" name="catalogoJson"
                    value='<?php echo htmlspecialchars(json_encode($catalogoPeliculas)); ?>'>
                <button type="submit" name="accion" value="Agregar"
                    class="btn-primary">Agregar</button>
            </form>
        </div>

        <!-- Formulario para buscar película -->
        <div class="mb-8">
            <form method="post" class="flex space-x-4">
                <input type="text" name="tituloBuscar" placeholder="Título"
                    class="input-field">
                <input type="hidden" name="catalogoJson"
                    value='<?php echo htmlspecialchars(json_encode($catalogoPeliculas)); ?>'>
                <button type="submit" name="accion" value="Buscar"
                    class="btn-primary">Buscar</button>
            </form>
        </div>

    <h1>Peliculas</h1>

        <!-- Listado de películas -->
        <div id="listado-peliculas" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php foreach ($catalogoMostrar as $pelicula): ?>
            <div class="p-4 border border-gray-300 rounded bg-white">
                <img src="<?php echo htmlspecialchars($pelicula['caratula']); ?>" alt="Carátula"
                    class="mb-4 rounded-md">
                <p class="mb-2"><strong>Título:</strong>
                    <?php echo htmlspecialchars($pelicula['titulo']); ?>
                </p>
                <p class="mb-2"><strong>Año:</strong>
                    <?php echo htmlspecialchars($pelicula['ano']); ?>
                </p>
                <p class="mb-2"><strong>Género:</strong>
                    <?php echo htmlspecialchars($pelicula['genero']); ?>
                </p>
                <form method="post">
                    <input type="hidden" name="tituloEliminar"
                        value="<?php echo htmlspecialchars($pelicula['titulo']); ?>">
                    <input type="hidden" name="catalogoJson"
                        value='<?php echo htmlspecialchars(json_encode($catalogoPeliculas)); ?>'>
                    <button type="submit" name="accion" value="Eliminar"
                        class="btn-danger">Eliminar</button>
                </form>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</body>

</html>