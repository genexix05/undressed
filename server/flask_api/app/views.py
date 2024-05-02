# app/views.py
from . import app  # Importa app desde el módulo local donde app está instanciado
from flask import jsonify
import subprocess

@app.route('/run_spider/<spider_name>')
def run_spider(spider_name):
    try:
        subprocess.run(['scrapy', 'crawl', spider_name], check=True)
        return jsonify({'status': 'success', 'message': f'Spider {spider_name} started successfully'})
    except subprocess.CalledProcessError as e:
        return jsonify({'status': 'error', 'message': str(e)})
