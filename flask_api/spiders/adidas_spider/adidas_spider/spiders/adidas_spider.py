import scrapy
from adidas_spider.items import AdidasProductItem
from scrapy.http import Request
from urllib.parse import urlencode

class AdidasSpider(scrapy.Spider):
    name = 'adidas'
    handle_httpstatus_list = [403]
    allowed_domains = ['adidas.es']
    # Excluir las URL prohibidas
    start_urls = ['https://www.adidas.es/calzado-golf-mujer']

    def parse(self, response):
        # Extracción de datos del HTML
        for product in response.css('div.product-card'):
            item = AdidasProductItem()
            item['id'] = product.css('::attr(data-product-id)').get()
            item['name'] = product.css('.product-name ::text').get()
            item['color'] = product.css('.product-color ::text').get()
            item['modelId'] = product.css('::attr(data-model-id)').get()
            item['price'] = product.css('.product-price ::text').get()
            item['salePrice'] = product.css('.sale-price ::text').get() or item['price']
            item['link'] = response.urljoin(product.css('a::attr(href)').get())
            item['image_urls'] = [response.urljoin(img) for img in product.css('img::attr(src)').extract()]
            yield item
        # Manejo de paginación si es necesario
        next_page = response.css('a.next-page::attr(href)').get()
        if next_page:
            yield response.follow(next_page, self.parse, meta={'dont_obey_robotstxt': True})

    def convert_product_dict_into_item(self, product):
        item = AdidasProductItem()
        item['id'] = product.get('id')
        item['name'] = product.get('name')
        item['color'] = product.get('color')
        item['modelId'] = product.get('modelId')
        item['price'] = product.get('price')
        item['salePrice'] = product.get('salePrice')
        item['link'] = product.get('link')
        item['image_urls'] = product.get('image_urls', [])
        return item
    
    def create_feed_api_request(self, next_page_link):
        params = {
            'page': next_page_link,
            'category': 'golf-shoes',
            'gender': 'women'
        }
        url = 'https://api.adidas.es/product-feed'
        full_url = f"{url}?{urlencode(params)}"
        return scrapy.Request(full_url, callback=self.parse_product_feed)

    def parse_product_feed(self, response):
        # Decodificar el JSON recibido de la API
        data = response.json()
        
        # Supongamos que la API devuelve una lista de productos en un campo 'products'
        for product_info in data.get('products', []):
            # Usar un método de conversión que hemos definido antes para convertir datos del diccionario en un item
            item = self.convert_product_dict_into_item({
                'id': product_info.get('id'),
                'name': product_info.get('name'),
                'color': product_info.get('color'),
                'modelId': product_info.get('modelId'),
                'price': product_info.get('price'),
                'salePrice': product_info.get('salePrice'),
                'link': product_info.get('link'),
                'image_urls': [img['src'] for img in product_info.get('images', [])]
            })
            yield item
        
        # Comprobar si hay más páginas para solicitar
        next_page_link = data.get('next_page')
        if next_page_link:
            yield self.create_feed_api_request(next_page_link)