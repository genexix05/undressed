import os
from flask import Flask, jsonify
import subprocess

app = Flask(__name__)

@app.route('/run_spider/<spider_name>')
def run_spider(spider_name):
    try:
        # Define el directorio correcto para ejecutar Scrapy
        project_path = os.path.abspath('../../spiders/stussy_spider')  # Ajusta según tu estructura
        os.chdir(project_path)  # Cambia al directorio del proyecto Scrapy

        # Ejecuta el comando Scrapy
        command = ['scrapy', 'crawl', spider_name]
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        stdout, stderr = process.communicate()
        
        if process.returncode != 0:
            return jsonify({'status': 'error', 'message': 'Error executing spider', 'stderr': stderr})
        else:
            return jsonify({'status': 'success', 'data': stdout, 'message': 'Spider executed successfully'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})
