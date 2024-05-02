from . import app
import subprocess

@app.route('/run_spider/<spider_name>')
def run_spider(spider_name):
    subprocess.run(['scrapy', 'crawl', spider_name])
    return {'status': f'Spider {spider_name} ejecutado'}
