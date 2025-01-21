<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ANUEL NEWS</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<?php
$dayOfWeek = date("N");

$cancionesFile = ($dayOfWeek <= 3) ? "primero.php" : "segundo.php";

if (file_exists($cancionesFile)) {
    include $cancionesFile;
    shuffle($canciones);
} else {
    echo "Error: No se pudo encontrar el archivo de canciones.";
}

switch ($dayOfWeek) {
    case 1:
        $tituloNoticia = "Anuel AA Anuncia Colaboracion epica con Artista Internacional";
        $textoNoticia = "Anuel AA sorprende a sus fans al revelar que esta trabajando en una colaboracion musical con un renombrado artista internacional. La noticia se vuelve viral antes del lanzamiento, generando expectativas y especulaciones sobre quien podria ser su misterioso compañero de cancion.";
        break;
    case 2:
        $tituloNoticia = "Nuevo Proyecto Benefico: Anuel AA Apoya a Comunidades Desfavorecidas";
        $textoNoticia = "El reguetonero muestra su lado solidario al lanzar un proyecto benefico destinado a ayudar a comunidades desfavorecidas. Anuncia donaciones significativas y planes a largo plazo para mejorar la calidad de vida de aquellos que mas lo necesitan.";
        break;
    case 3:
        $tituloNoticia = "Anuel AA Incursiona en el Mundo del Cine";
        $textoNoticia = "Anuel AA da un giro sorprendente en su carrera al anunciar su participacion en una pelicula. El artista revela detalles sobre su personaje y la trama, dejando a sus seguidores emocionados por verlo en una nueva faceta artistica.";
        break;
    case 4:
        $tituloNoticia = "Polemica en Redes Sociales: Anuel AA Responde a Rumores de Ruptura";
        $textoNoticia = "Se desata una controversia en las redes sociales cuando circulan rumores sobre una supuesta ruptura en la vida amorosa de Anuel AA. El artista responde directamente a los comentarios, desmintiendo los chismes y compartiendo mensajes de amor y estabilidad.";
        break;
    case 5:
        $tituloNoticia = "Anuel AA Lanza Linea de Moda Exclusiva";
        $textoNoticia = "El reguetonero no solo conquista el mundo de la musica, sino que tambien entra en la industria de la moda con el lanzamiento de su propia linea exclusiva. Los fanaticos pueden vestir el estilo distintivo de Anuel AA gracias a esta nueva coleccion.";
        break;
    case 6:
        $tituloNoticia = "Colaboracion Inesperada: Anuel AA y Artista de Genero Opuesto Juntos en Nuevo Sencillo";
        $textoNoticia = "Anuel AA desafia las expectativas al revelar una colaboracion con una reconocida artista de un genero musical completamente diferente al suyo. La cancion se convierte en un exito instantaneo, fusionando estilos de manera unica.";
        break;
    case 7:
        $tituloNoticia = "Anuel AA Anuncia Gira Mundial con Show Experiencial";
        $textoNoticia = "Preparandose para llevar su musica a nivel internacional, Anuel AA anuncia una gira mundial con un enfoque unico. Promete a los fanaticos una experiencia inolvidable, combinando su musica con efectos visuales y escenografia de vanguardia. Las entradas se agotan rapidamente ante la alta demanda.";
        break;
    default:
        echo "Error: Dia de la semana no valido.";
        exit;
}

$imagenes = [
    "https://www.billboard.com/wp-content/uploads/2020/05/01-anuel-aa-2020-cr-Familia-Gazmey-billboard-1548-1590610966.jpg?w=942&h=623&crop=1",
    "https://www.eluniverso.com/resizer/ocClkN4k0i-Sb7Wsm5BD4Y98MyE=/1031x670/smart/filters:quality(70)/cloudfront-us-east-1.images.arcpublishing.com/eluniverso/6AUVY64XOZHXPCVRRIKR66JCPE.jpg",
    "https://www.lecturas.com/medio/2023/10/10/anuel-aa_f8553f5a_231010211215_1280x720.jpg",
    "https://yt3.googleusercontent.com/D1lQ87X3Hp1T-Y51_e0IylDU_3Buitkjw_9v1W54lChulTF_5VIptlXp2lyz-1gteLD_PiNU=s900-c-k-c0x00ffffff-no-rj",
    "https://upload.wikimedia.org/wikipedia/commons/3/3c/Anuel_AA_in_2022.png",
    "https://i0.wp.com/www.datiaopr.com/wp-content/uploads/2023/08/Anuel-AA-2.jpg",
    "https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2023/10/09/16968359331567.jpg",
    "https://dice-media.imgix.net/attachments/2022-11-17/a458e0b6-6210-4f5c-915e-4e46fbf2dc24.jpg?rect=0%2C0%2C640%2C640&auto=format%2Ccompress&q=80&w=722&h=722&fit=crop&crop=faces%2Ccenter",
    "https://hips.hearstapps.com/hmg-prod/images/anuel-aa-attends-the-2023-latin-american-music-awards-at-news-photo-1696843062.jpg?crop=1.00xw:0.654xh;0,0.0308xh&resize=1200:*",
    "https://www.wvnstv.com/wp-content/uploads/sites/76/2021/12/76164ac5e64b43e684b89d3efbc2d579.jpg?w=2560&h=1440&crop=1",
    "https://images.hola.com/us/images/0280-17b296cb71f8-04af7f5071a5-1000/horizontal-1200/anuel-aa.jpg",
    "https://idmphsmkuxkn.compat.objectstorage.us-ashburn-1.oraclecloud.com/cdn-bucket/uploads/2023/03/Anuel-AA-8.png",
    "https://elcomercio.pe/resizer/GHkztC01tjsaJwl00mPJK0fOgvI=/580x330/smart/filters:format(jpeg):quality(90)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/VIM5CF35UZHH3IT7CL5GBPWN2M.jpg",
    "https://cdn0.celebritax.com/sites/default/files/styles/watermark_100/public/1696256335-anuel-aa-promete-revolucionar-industria-rompecorazones-voy-dominar-genero.jpg",
    "https://staticg.sportskeeda.com/editor/2023/10/b599e-16969420327546-1920.jpg?w=840",
    "https://ibiza-spotlight1.b-cdn.net/sites/default/files/styles/auto_1500_width/public/article-images/137903/slideshow-1651649441.jpeg",
    "https://elcomercio.pe/resizer/-IyLMwcxzpsv-nY6M4YZQhYBxQA=/980x528/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/367B45KMZRFJBLRFDJYRCYNFEY.jpg",
    "https://los40.com/resizer/lxKSVrmN0TmI1jMC3eJlLdjqLgw=/1200x900/filters:format(jpg):quality(70)/cloudfront-eu-central-1.images.arcpublishing.com/prisaradiolos40/YT3LADPVRNLJDEHS6VQBQ2DASU.jpg",
    "https://laopinion.com/wp-content/uploads/sites/3/2023/02/Anuel-AA-1-e1676080193242.jpg?w=2600",
    "https://elcomercio.pe/resizer/68U2rPfwVBnCp8yjwgG7Mi3V-xw=/1200x1200/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/GPUUJ5M7LBAX7CZTRYW75SJRGY.jpg"
];

shuffle($imagenes);

$imagen1 = $imagenes[0];
$imagen2 = $imagenes[1];
$imagen3 = $imagenes[2];

?>
<header>
    <img src="logo.png">
</header>
<h1><?= $tituloNoticia ?></h1>
<div class="container">
    <div class="info-box">
        <img src="<?= $imagen1 ?>" style="width: 20%;">
        <img src="<?= $imagen2 ?>" alt="" style='display: inline-block; float: right; width: 35%;'>
        <p><?= $textoNoticia ?></p>
        <img src="<?= $imagen3 ?>" alt="" style="width: 30%;">
        <p><?= $textoNoticia ?></p>
    </div>
    <h2>Canciones Recomendadas</h2>
    <?php
    $i = 0;
    foreach ($canciones as $clave => $detalle) {
        if ($i < 5) {
            $nombreCancion = $detalle['cancion'];
            $urlPortada = $detalle['url'];

            echo "<div style='display: inline-block; text-align: center; margin: 2px'>";
            echo "<img src='$urlPortada' alt='$nombreCancion' style='width: 150px;'>";
            echo "<p>$nombreCancion</p>";
            echo "</div>";

            $i++;
        }
    }
    ?>
</div>


</body>
</html>
