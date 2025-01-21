<?php
/*
Plugin Name: Editor y Generador de Landing Pages
Plugin URI: http://amn.amn
Description: Permite seleccionar y editar temas de forma sencilla.
Version: Alpha
Author: Alejandro Martínez
Author URI: http://amn.amn
License: GPL2
*/

// Añadir el menú del plugin en el panel de administración
function egp_agregar_menu()
{
    add_menu_page('Editor y Generador de Landing Pages', 'CTS Landing Pages', 'manage_options', 'eg-landing-pages', 'egp_pagina_principal', 'dashicons-layout');
}

add_action('admin_menu', 'egp_agregar_menu');

function egp_pagina_principal()
{
    $temas = wp_get_themes();
    $nonce = wp_create_nonce("cargar_editor_seguro");
?>
    <div class="wrap">
        <h1>Editor y Generador de Landing Pages</h1>
        <p>Seleccione un tema para comenzar y proporcionar detalles para la nueva página:</p>
        <form id="selectThemeForm">
            <select id="tema_seleccionado" name="tema_seleccionado">
                <?php foreach ($temas as $tema) : ?>
                    <option value="<?php echo esc_attr($tema->get_stylesheet()); ?>">
                        <?php echo esc_html($tema->Name); ?>
                    </option>
                <?php endforeach; ?>
            </select>
            <input type="text" id="page_title" placeholder="Título de la Página" style="width: 100%; margin-top: 10px;" />
            <textarea id="page_description" placeholder="Descripción de la Página" style="width: 100%; margin-top: 10px;"></textarea>
            <button type="button" onclick="cargarEditor();">Cargar Editor</button>
        </form>
        <div id="editorContainer" style="margin-top:20px;"></div>
    </div>
    <script>
        function cargarEditor() {
            var temaSeleccionado = document.getElementById('tema_seleccionado').value;
            var titulo = document.getElementById('page_title').value;
            var descripcion = document.getElementById('page_description').value;
            document.getElementById('editorContainer').innerHTML = '<p>Cargando editor para el tema ' + temaSeleccionado + '...</p>';

            var data = {
                'action': 'cargar_editor_para_tema',
                'tema': temaSeleccionado,
                'title': titulo,
                'description': descripcion,
                'security': '<?php echo $nonce; ?>'
            };

            jQuery.post(ajaxurl, data, function(response) {
                document.getElementById('editorContainer').innerHTML = response;
            });
        }
    </script>
<?php
}


// Agregar acciones de AJAX para usuarios autenticados
add_action('wp_ajax_cargar_editor_para_tema', 'egp_cargar_editor_para_tema');

function egp_cargar_editor_para_tema() {
    check_ajax_referer('cargar_editor_seguro', 'security');

    $tema = isset($_POST['tema']) ? sanitize_text_field($_POST['tema']) : '';
    $descripcion = isset($_POST['description']) ? sanitize_textarea_field($_POST['description']) : '';

    // Aquí implementarías la llamada a la API de IA para generar contenido
    $contenido_generado = egp_generate_content_with_ai($descripcion);

    // Crear la nueva página con el contenido generado
    $new_page = array(
        'post_title'    => 'Generado por IA', // Puedes permitir que el usuario establezca esto también
        'post_content'  => $contenido_generado,
        'post_status'   => 'draft', // O 'publish'
        'post_type'     => 'page',
    );

    $post_id = wp_insert_post($new_page);

    if ($post_id != 0) {
        $respuesta = '<div>Página creada con éxito. ID: ' . $post_id . '</div>';
    } else {
        $respuesta = '<div>Error al crear la página.</div>';
    }

    echo $respuesta;
    wp_die();
}

function egp_generate_content_with_ai($description) {
    // Implementación de la API de IA
    // Esta es una función de ejemplo para realizar una solicitud a una API de IA como OpenAI
    $api_key = 'gAAAAABmIjmSaJu_OlqEib36rBXOZMX83VPBXYXdqZxie1GtX65Jm5kPQQdhjHZ8CXvHFBczw0MICEtZg7w602vRjupEFYyNE9yAwUeJWBGUtYWL_8B-bnwresUSnVbedfLZybZzi33_';
    $api_url = 'https://api.textcortex.com/v1/codes';

    $response = wp_remote_post($api_url, array(
        'method'      => 'POST',
        'timeout'     => 45,
        'redirection' => 5,
        'httpversion' => '1.0',
        'blocking'    => true,
        'headers'     => array(
            'Authorization' => 'Bearer ' . $api_key,
            'Content-Type'  => 'application/json',
        ),
        'body'        => json_encode(array('text' => $description)),
        'cookies'     => array()
    ));

    if (is_wp_error($response)) {
        $error_message = $response->get_error_message();
        return "Algo salió mal: $error_message";  // Diagnostica el error
    } else {
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        if (isset($data['error'])) {
            return 'Error en la API de IA: ' . $data['error']['message'];  // Captura errores específicos de la API
        }
        return $data['choices'][0]['text'] ?? 'Contenido no generado';
    }
}

function egp_enqueue_scripts() {
    wp_enqueue_script('egp-custom-js', plugins_url('/js/custom.js', __FILE__), array('jquery'), null, true);
    wp_localize_script('egp-custom-js', 'ajax_object', array( 'ajaxurl' => admin_url('admin-ajax.php') ));
}

add_action('wp_enqueue_scripts', 'egp_enqueue_scripts');


add_action('wp_ajax_guardar_landing_page', 'egp_guardar_landing_page');

function egp_guardar_landing_page()
{
    // Verificar nonce para seguridad
    check_ajax_referer('egp_seguro', 'security');

    // Guardar los datos enviados en POST
    if (isset($_POST['contenido'])) {
        // Aquí guardas el contenido en la base de datos o como post meta
        // Responder algo al frontend
        echo json_encode(array('success' => true, 'message' => 'Guardado correctamente.'));
    } else {
        echo json_encode(array('success' => false, 'message' => 'No se recibió contenido.'));
    }
    wp_die();  // Terminar adecuadamente la ejecución en una función AJAX
}

?>