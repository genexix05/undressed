import scrapy
from flask import Flask, jsonify, request
from flask_cors import CORS
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
import mysql.connector
from mysql.connector import Error
import re

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


class YeezySpider(scrapy.Spider):
    name = 'yeezy'
    allowed_domains = ['yeezy.com']
    start_urls = ['https://yeezy.com/']

    def parse(self, response):
        styles = " ".join(response.css('style ::text').getall())
        for product in response.css('.product-card'):
            product_id = product.css('.product-card-image::attr(id)').get()
            if product_id:
                pattern = rf'#{re.escape(product_id)}\s*{{.*?background-image:\s*url\((//.*?\.png).*?\)'
                match = re.search(pattern, styles, re.DOTALL | re.IGNORECASE)
                if match:
                    image_url = f"https:{match.group(1)}"
                else:
                    image_url = 'Imagen no disponible'
            else:
                image_url = 'Imagen no disponible'

            yield {
                'name': product.css('.product-card-title::text').get().strip(),
                'url': response.urljoin(product.css('::attr(href)').get()).strip(),
                'price': product.css('.product-card-price::text').get(default='Precio no disponible').strip(),
                'image_url': image_url,
            }

        next_page = response.css('a.next::attr(href)').get()
        if next_page is not None:
            yield response.follow(next_page, self.parse)

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

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
    return response

# Flask app runner
if __name__ == '__main__':
    app.run(debug=True, port=5000)
