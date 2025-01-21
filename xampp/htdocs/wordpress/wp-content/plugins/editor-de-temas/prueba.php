<?php


function edt_agregar_menu_administrador()
{
    add_menu_page(
        'Editor de Temas', // Título de la página
        'Editor de Temas CTS', // Título del menú
        'manage_options', // Capacidad requerida
        'editor-de-temas', // Slug del menú
        'edt_mostrar_interfaz_admin', // Función que mostrará el contenido
        'dashicons-admin-appearance', // Icono
        20 // Posición
    );
}

add_action('admin_menu', 'edt_agregar_menu_administrador');

function edt_mostrar_interfaz_admin()
{
    ?>
    <style>
        .edt-wrapper {
            max-width: 900px;
            margin: 20px;
            padding: 20px;
            background-color: #f1f1f1;
            border-radius: 5px;
        }

        .edt-select,
        .edt-button {
            width: 100%;
            padding: 10px;
            margin-top: 5px;
            margin-bottom: 15px;
            box-sizing: border-box;
        }

        .edt-textarea {
            width: 100%;
            height: 400px;
            padding: 10px;
            box-sizing: border-box;
            font-family: monospace;
        }
    </style>
    <div class="wrap edt-wrapper">
        <h1>Editor de Temas</h1>
        <form method="post" action="">
            <label for="tema_seleccionado">Seleccione un tema:</label>
            <select id="tema_seleccionado" name="tema_seleccionado" class="edt-select" onchange="this.form.submit()">
                <?php
                $temas = wp_get_themes();
                $tema_actual = get_stylesheet(); // Obtener el tema actualmente activo
                foreach ($temas as $tema) {
                    $selected = $tema->get_stylesheet() === $tema_actual ? 'selected' : '';
                    echo '<option value="' . esc_attr($tema->get_stylesheet()) . '" ' . $selected . '>' . $tema->Name . '</option>';
                }
                ?>
            </select>
        </form>
        <?php
        if (isset($_POST['tema_seleccionado'])) {
            $tema_actual = $_POST['tema_seleccionado'];
            switch_theme($tema_actual); // Cambia el tema
        }

        // Mostrar archivos del tema seleccionado para editar
        if (!empty($tema_actual)) {
            $tema = wp_get_theme($tema_actual);
            $dir_tema = $tema->get_stylesheet_directory();
            $archivos_tema = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir_tema));
            echo '<form method="post">';
            echo '<select name="archivo_seleccionado">';
            // Listado de archivos en el formulario
            foreach ($archivos_tema as $archivo) {
                if ($archivo->isFile()) {
                    $ruta_rel = str_replace($dir_tema . DIRECTORY_SEPARATOR, '', $archivo->getPathname());
                    // Excluir archivos dentro de la carpeta 'assets'
                    if (strpos($ruta_rel, 'assets/') === false) {
                        echo '<option value="' . esc_attr($ruta_rel) . '">' . $ruta_rel . '</option>';
                    }
                }
            }
            echo '</select>';
            echo '<input type="submit" value="Editar Archivo" class="button button-primary">';
            echo '</form>';

            if (isset($_POST['archivo_seleccionado'])) {
                $archivo_editar = $dir_tema . DIRECTORY_SEPARATOR . $_POST['archivo_seleccionado'];
                if (file_exists($archivo_editar)) {
                    $contenido_archivo = file_get_contents($archivo_editar);
                    echo '<form method="post">';
                    echo '<div id="editor" class="edt-textarea">' . esc_textarea($contenido_archivo) . '</div>';
                    echo '<textarea name="contenido_archivo" id="contenido_archivo" style="display:none;"></textarea>';
                    echo '<input type="hidden" name="archivo_guardar" value="' . esc_attr($_POST['archivo_seleccionado']) . '">';
                    echo '<input type="submit" value="Guardar Cambios" class="button button-primary" id="submit_button">';
                    echo '</form>';
                } else {
                    echo "<p>Error: El archivo no existe.</p>";
                }
            }
        }
        ?>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ext-language_tools.js"></script>
    <script>
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode("ace/mode/html");
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: false
        });
        var textarea = document.getElementById('contenido_archivo');
        editor.getSession().on('change', function () {
            textarea.value = editor.getSession().getValue();
        });
        document.getElementById('submit_button').onclick = function () {
            textarea.value = editor.getSession().getValue();
        };
    </script>
<?php
}



function edt_guardar_cambios_archivo()
{
    if (isset($_POST['archivo_guardar']) && current_user_can('edit_themes')) {
        $tema = wp_get_theme(get_stylesheet());
        $archivo_guardar = $tema->get_stylesheet_directory() . '/' . $_POST['archivo_guardar'];
        if (isset($_POST['contenido_archivo']) && file_exists($archivo_guardar)) {
            file_put_contents($archivo_guardar, stripslashes($_POST['contenido_archivo']));
        }
    }
}

add_action('admin_init', 'edt_guardar_cambios_archivo');
