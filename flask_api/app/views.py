# app/views.py
from flask import Flask, jsonify
import subprocess

app = Flask(__name__)

@app.route('/run_spider/<spider_name>')
def run_spider(spider_name):
    try:
        # Asegúrate de que el comando y la ruta al ejecutable de scrapy sean correctos
        subprocess.run(['scrapy', 'crawl', spider_name], check=True)
        return jsonify({'status': 'success', 'message': f'Spider {spider_name} started successfully'})
    except subprocess.CalledProcessError as e:
        return jsonify({'status': 'error', 'message': str(e)})
