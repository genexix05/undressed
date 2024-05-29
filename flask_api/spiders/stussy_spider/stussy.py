import scrapy
from flask import Flask, jsonify, request
from flask_cors import CORS
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route('/run_spider/<spider_name>', methods=['GET', 'OPTIONS'])
def run_spider(spider_name):
    if request.method == 'OPTIONS':
        response = jsonify({"status": "success", "message": "Preflight request successful"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,OPTIONS")
        return response

    category = request.args.get('category')
    process = CrawlerProcess(get_project_settings())
    if spider_name.lower() == 'stussy':
        spider_class = StussyProductsSpider
    else:
        response = jsonify({"status": "error", "message": f"Spider no encontrado para la marca: {spider_name}"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 404

    try:
        process.crawl(spider_class, category=category)
        process.start()
        response = jsonify({"status": "success", "spider": spider_name})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response
    except Exception as e:
        response = jsonify({"status": "error", "message": str(e)})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 500

@app.route('/run_spider/<spider_name>_update', methods=['GET', 'OPTIONS'])
def run_spider_update(spider_name):
    if request.method == 'OPTIONS':
        response = jsonify({"status": "success", "message": "Preflight request successful"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,OPTIONS")
        return response

    category = request.args.get('category')
    process = CrawlerProcess(get_project_settings())
    if spider_name.lower() == 'stussy':
        spider_class = StussyUpdateSpider
    else:
        response = jsonify({"status": "error", "message": f"Spider no encontrado para la marca: {spider_name}"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 404

    try:
        process.crawl(spider_class, category=category)
        process.start()
        response = jsonify({"status": "success", "spider": f"{spider_name}_update"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response
    except Exception as e:
        response = jsonify({"status": "error", "message": str(e)})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 500

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
    return response

class StussyProductsSpider(scrapy.Spider):
    name = 'stussy'
    allowed_domains = ['eu.stussy.com']
    start_urls = ['https://eu.stussy.com/es-es/collections/all']

    def __init__(self, category=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.category = category

    def parse(self, response):
        self.logger.info(f'Parsing page: {response.url}')
        products = response.css('li.collection-grid__grid-item')
        if not products:
            self.logger.info('No products found on page')
            return

        for product in products:
            yield {
                'name': product.css('.product-card__title-link::text').get(),
                'url': response.urljoin(product.css('.product-card__title-link::attr(href)').get()),
                'price': product.css('.product-card__price span::text').get(),
                'image_urls': product.css('.product-card__image img::attr(src)').getall(),
                'sizes': [size.strip() for size in product.css('.product-card__size-variant-link::text').getall()],
                'category': self.category
            }

        current_page_number = int(response.url.split('page=')[-1]) if 'page=' in response.url else 1
        next_page_number = current_page_number + 1
        next_page_url = f'https://eu.stussy.com/es-es/collections/all?page={next_page_number}'

        if len(products) == 48:
            self.logger.info(f'Following to next page: {next_page_url}')
            yield response.follow(next_page_url, self.parse)

class StussyUpdateSpider(StussyProductsSpider):
    name = 'stussy_update'

    def open_spider(self, spider):
        try:
            self.connection = mysql.connector.connect(
                host='127.0.0.1',
                user='root',
                passwd='',
                database='undressed'
            )
            if self.connection.is_connected():
                self.cursor = self.connection.cursor(buffered=True)
                self.logger.info("Conexión establecida a la base de datos.")
        except Error as e:
            self.logger.error("Error al conectar a la base de datos: %s", e)

    def close_spider(self, spider):
        try:
            if self.connection.is_connected():
                self.cursor.close()
                self.connection.close()
                self.logger.info("Conexión a la base de datos cerrada.")
        except Error as e:
            self.logger.error("Error al cerrar la conexión a la base de datos: %s", e)

    def parse(self, response):
        self.logger.info(f'Updating page: {response.url}')
        products = response.css('li.collection-grid__grid-item')
        if not products:
            self.logger.info('No products found on page')
            return

        for product in products:
            item = {
                'name': product.css('.product-card__title-link::text').get(),
                'url': response.urljoin(product.css('.product-card__title-link::attr(href)').get()),
                'price': product.css('.product-card__price span::text').get(),
                'image_urls': product.css('.product-card__image img::attr(src)').getall(),
                'sizes': [size.strip() for size in product.css('.product-card__size-variant-link::text').getall()],
                'category': self.category
            }
            self.insert_if_not_exists(item)

        current_page_number = int(response.url.split('page=')[-1]) if 'page=' in response.url else 1
        next_page_number = current_page_number + 1
        next_page_url = f'https://eu.stussy.com/es-es/collections/all?page={next_page_number}'

        if len(products) == 48:
            self.logger.info(f'Following to next page: {next_page_url}')
            yield response.follow(next_page_url, self.parse)

    def insert_if_not_exists(self, item):
        try:
            self.cursor.execute("SELECT id FROM products WHERE url = %s", (item['url'],))
            result = self.cursor.fetchone()
            if not result:
                sql_query = '''
                    INSERT INTO products (name, url, price, image_urls, sizes) VALUES (%s, %s, %s, %s, %s)
                '''
                values = (
                    item['name'],
                    item['url'],
                    item['price'],
                    ','.join(item['image_urls']),
                    ','.join(item['sizes'])
                )
                self.cursor.execute(sql_query, values)
                self.connection.commit()
                self.logger.info("Datos insertados correctamente en la base de datos: %s", values)
            else:
                self.logger.info("Producto ya existe en la base de datos: %s", item['url'])
        except Error as e:
            self.logger.error("Error al insertar datos en la base de datos:")
            self.logger.error("MySQL Error: %s", e)

# Flask app runner
if __name__ == '__main__':
    app.run(debug=True, port=5000)
