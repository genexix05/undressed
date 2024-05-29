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

    spider_classes = {
        'stussy': StussyProductsSpider,
        'yeezy': YeezySpider
    }

    spider_class = spider_classes.get(spider_name.lower())

    if spider_class is None:
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

    spider_classes = {
        'stussy': StussyUpdateSpider,
    }

    spider_class = spider_classes.get(spider_name.lower())

    if spider_class is None:
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

class YeezySpider(scrapy.Spider):
    name = 'yeezy'
    allowed_domains = ['yeezy.com']
    start_urls = ['https://yeezy.com/']

    def parse(self, response):
        # Extraer todos los bloques de estilo CSS y concatenarlos en una sola cadena de texto
        styles = " ".join(response.css('style ::text').getall())
        for product in response.css('.product-card'):
            product_id = product.css('.product-card-image::attr(id)').get()
            if product_id:
                # Construir un patrón regex que coincida con el ID del producto específico y extraer las URLs de la imagen
                pattern = rf'#{re.escape(product_id)}\s*{{.*?background-image:\s*url\((//.*?\.png).*?\)'
                match = re.search(pattern, styles, re.DOTALL | re.IGNORECASE)
                if match:
                    # Añadir 'https:' al comienzo de la URL encontrada
                    image_url = f"https:{match.group(1)}"
                else:
                    image_url = 'Imagen no disponible'
            else:
                image_url = 'Imagen no disponible'

            yield {
                'name': product.css('.product-card-title::text').get().strip(),
                'price': product.css('.product-card-price::text').get(default='Precio no disponible').strip(),
                'image_url': image_url,
                'url': response.urljoin(product.css('::attr(href)').get()).strip(),
            }

        next_page = response.css('a.next::attr(href)').get()
        if next_page is not None:
            yield response.follow(next_page, self.parse)

# Flask app runner
if __name__ == '__main__':
    app.run(debug=True, port=5000)
