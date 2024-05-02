import os
import subprocess
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/run_spider/<spider_name>')
def run_spider(spider_name):
    try:
        # Guarda el directorio actual y cambia al directorio del proyecto Scrapy
        original_cwd = os.getcwd()
        os.chdir('../scrapy.cfg')  # Asegúrate de que este es el camino correcto al proyecto Scrapy
        
        # Ejecuta el comando Scrapy
        subprocess.run(['scrapy', 'crawl', spider_name], check=True)
        
        # Restaura el directorio original
        os.chdir(original_cwd)
        
        return jsonify({'status': 'success', 'message': f'Spider {spider_name} started successfully'})
    except subprocess.CalledProcessError as e:
        os.chdir(original_cwd)  # Restablece el directorio en caso de error
        return jsonify({'status': 'error', 'message': str(e)})
    except Exception as e:
        os.chdir(original_cwd)  # Restablece el directorio en caso de error
        return jsonify({'status': 'error', 'message': str(e)})
