import os
import sys
from flask import Flask, jsonify
import subprocess

app = Flask(__name__)

@app.route('/run_spider/<spider_name>')
def run_spider(spider_name):
    try:
        # Establecer el directorio correcto para Scrapy
        project_path = os.path.abspath('../../spiders/stussy_spider')  # Ajusta según tu estructura
        os.chdir(project_path)  # Cambiar al directorio del proyecto Scrapy

        # Agregar el directorio del proyecto a sys.path
        if project_path not in sys.path:
            sys.path.append(project_path)

        # Ejecutar el comando Scrapy
        command = ['scrapy', 'crawl', spider_name]
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()

        if process.returncode != 0:
            return jsonify({'status': 'error', 'message': stderr.decode()})
        else:
            return jsonify({'status': 'success', 'message': stdout.decode()})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})
