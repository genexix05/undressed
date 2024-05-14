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
        command = ['scrapy', 'crawl', spider_name, '-o', '-:json', '--nolog']
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        stdout, stderr = process.communicate()

        if process.returncode == 0:
            if stdout:
                try:
                    data = json.loads(stdout)  # Intenta parsear el JSON
                    return jsonify({'status': 'success', 'data': data})
                except json.JSONDecodeError:
                    return jsonify({'status': 'error', 'message': 'No se pudo decodificar JSON', 'data': stdout})
            else:
                return jsonify({'status': 'error', 'message': 'No hay datos', 'stderr': stderr})
        else:
            return jsonify({'status': 'error', 'message': 'Error ejecutando el spider', 'stderr': stderr})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})
