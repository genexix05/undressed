import scrapy

class StussyProductsSpider(scrapy.Spider):
    name = 'stussy'
    allowed_domains = ['eu.stussy.com']
    start_urls = ['https://eu.stussy.com/es-es/collections/all']

    def parse(self, response):
        # Extrae los productos de la página actual
        products = response.css('li.collection-grid__grid-item')
        if not products:
            return  # Si no hay productos, detén el spider

        for product in products:
            yield {
                'name': product.css('.product-card__title-link::text').get(),
                'url': response.urljoin(product.css('.product-card__title-link::attr(href)').get()),
                'price': product.css('.product-card__price span::text').get(),
                'image_urls': product.css('.product-card__image img::attr(src)').getall(),
                'sizes': [size.strip() for size in product.css('.product-card__size-variant-link::text').getall()]
            }

        # Prepara la siguiente página
        current_page_number = response.url.split('page=')[-1] if 'page=' in response.url else 1
        next_page_number = int(current_page_number) + 1
        next_page_url = f'https://eu.stussy.com/es-es/collections/all?page={next_page_number}'

        # Solo sigue si la cantidad de productos es la esperada por página, por ejemplo, 48
        if len(products) == 48:
            yield response.follow(next_page_url, self.parse)
