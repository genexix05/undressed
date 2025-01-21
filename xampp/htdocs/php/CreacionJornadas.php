<?php

function generarCalendario($equipos) {
    $numEquipos = count($equipos);

    if ($numEquipos % 2 != 0) {
        array_push($equipos, 'Descanso'); // Agregar un equipo de descanso si el número de equipos es impar
        $numEquipos++;
    }

    $jornadas = [];
    $numJornadas = $numEquipos - 1;

    for ($i = 1; $i <= $numJornadas; $i++) {
        $jornada = [];

        for ($j = 0; $j < $numEquipos / 2; $j++) {
            $equipoLocal = $equipos[$j];
            $equipoVisitante = $equipos[$numEquipos - 1 - $j];

            if ($equipoLocal != 'Descanso' && $equipoVisitante != 'Descanso') {
                // Ajustar la lógica para asegurar que todos los equipos alternen entre ser local y visitante
                if ($i % 2 == 0) {
                    $partido = ($j % 2 == 0) ? "$equipoVisitante vs $equipoLocal" : "$equipoLocal vs $equipoVisitante";
                } else {
                    $partido = "$equipoLocal vs $equipoVisitante";
                }

                array_push($jornada, $partido);
            }
        }

        // Rotar equipos para la siguiente jornada, asegurando que el equipo 1 alterne entre ser local y visitante
        $ultimoEquipo = array_pop($equipos);
        array_splice($equipos, 1, 0, $ultimoEquipo);

        array_push($jornadas, $jornada);
    }

    return $jornadas;
}

$equipos = ['Equipo 1', 'Equipo 2', 'Equipo 3', 'Equipo 4', 'Equipo 5', 'Equipo 6', 'Equipo 7', 'Equipo 8', 'Equipo 9', 'Equipo 10','Equipo 11'];
$jornadas = generarCalendario($equipos);

echo '<html>';
echo '<head>';
echo '<title>Calendario de Jornadas</title>';
echo '</head>';
echo '<body>';

foreach ($jornadas as $index => $jornada) {
    echo "<h2>Jornada " . ($index + 1) . "</h2>";
    echo '<ul>';
    foreach ($jornada as $partido) {
        echo "<li>$partido</li>";
    }
    echo '</ul>';
}

echo '</body>';
echo '</html>';
?>
