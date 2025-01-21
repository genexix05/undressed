<?php

function esColorValido($color) {
    return preg_match('/^#[a-fA-F0-9]{6}$/', $color);
}

function esFuenteValida($fuente) {
    $fuentesValidas = ['Arial', 'Times New Roman', 'Verdana', 'Georgia', 'Courier New'];
    return in_array($fuente, $fuentesValidas);
}

function esTamanoValido($tamano) {
    return filter_var($tamano, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 72]]);
}

function aplicaEstilo($datos) {
    if (
        isset($datos['color'], $datos['fuente'], $datos['tamano'], $datos['perfil']) &&
        esColorValido($datos['color']) &&
        esFuenteValida($datos['fuente']) &&
        esTamanoValido($datos['tamano'])
    ) {
        $_SESSION['estilos'][$datos['perfil']] = [
            'color' => $datos['color'],
            'fuente' => $datos['fuente'],
            'tamano' => (int)$datos['tamano']
        ];

        $_SESSION['perfilActivo'] = $datos['perfil'];
    } else {
        // Mostrar un mensaje de error si los datos no son válidos
        echo "<p>Error: Datos de estilo no válidos.</p>";
    }
}
