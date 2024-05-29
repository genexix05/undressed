import os
from flask import Flask, jsonify
import subprocess
import json

app = Flask(__name__)

@app.route('/run_spider/<spider_name>')
def run_spider(spider_name):
    try:
        # Define el directorio correcto para ejecutar Scrapy
        project_path = os.path.abspath('../../spiders/stussy_spider')  # Ajusta según tu estructura
        os.chdir(project_path)  # Cambia al directorio del proyecto Scrapy

        # Añade el formato de salida JSON al comando
        command = ['scrapy', 'crawl', spider_name, '-o', 'output.json', '--nolog']
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        stdout, stderr = process.communicate()

        if process.returncode == 0:
            # Lee el archivo JSON generado
            try:
                with open('output.json', 'r', encoding='utf-8') as f:
                    data = json.load(f)  # Carga el JSON
                os.remove('output.json')  # Elimina el archivo JSON después de leerlo
                return jsonify({'status': 'success', 'data': data})
            except json.JSONDecodeError:
                return jsonify({'status': 'error', 'message': 'No se pudo decodificar JSON', 'data': stdout})
        else:
            return jsonify({'status': 'error', 'message': 'Error ejecutando el spider', 'stderr': stderr})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
