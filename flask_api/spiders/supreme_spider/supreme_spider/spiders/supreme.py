import scrapy

class SupremeSpider(scrapy.Spider):
    name = 'supreme'
    allowed_domains = ['eu.supreme.com']
    start_urls = ['https://eu.supreme.com/collections/all?nt=1&']

    def parse(self, response):
        # El contenedor principal de los productos
        product_container = response.css('ul.collection-ul')
        # Iterar sobre cada producto dentro del contenedor
        for product in product_container.css('li.collection-product-item'):
            # Extraer y limpiar los datos usando CSS selectors
            yield {
                'name': product.css('a::attr(data-cy-title)').get(),
                'link': response.urljoin(product.css('a::attr(href)').get()),
                'image_link': product.css('img::attr(src)').get(),
                'price': product.css('span::text').re_first(r'€\d+'),
                'availability': 'Sold Out' if product.css('.lineHeight-1.hideChildren-child').get() else 'Available',
                'new': 'New' if product.css('span.position-absolute.pinTR').get() else 'Not New',
                # Añade más campos si los necesitas
            }
