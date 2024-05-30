import scrapy

class LouisVuittonSpider(scrapy.Spider):
    name = 'louisvuitton'
    allowed_domains = ['www.louisvuitton.com']
    start_urls = ['https://www.louisvuitton.com/esp-es/buscar/todos']

    def parse(self, response):
        # Seleccionamos cada producto por su clase
        for product in response.css('li.lv-product-list__item'):
            yield {
                'name': product.css('h2.lv-product-card__name::text').get(),
                'link': response.urljoin(product.css('a.lv-smart-link::attr(href)').get()),
                'price': product.css('span.notranslate::text').get(),
                'image': product.css('picture img::attr(srcset)').get().split(',')[-1].split('?')[0],  # Asumimos que queremos la imagen de mayor resolución
                # Extraer más detalles según sea necesario
            }

        # Opcional: seguir paginación si existe
        next_page = response.css('a.next::attr(href)').get()
        if next_page is not None:
            yield response.follow(next_page, self.parse)
