import scrapy

class OffWhiteSpider(scrapy.Spider):
    name = 'offwhite'
    allowed_domains = ['off---white.com']
    start_urls = ['https://www.off---white.com/en-es/sets/new-in']

    def parse(self, response):
        # Extracción de cada producto
        for product in response.css('li div[data-insights-object-id]'):
            yield {
                'id': product.attrib['id'],
                'availability': product.css('p.css-160e4dy::text').get(),
                'name': product.css('section.css-ed24t1 p.css-1dw89jd::text').get(),
                'url': response.urljoin(product.css('a.css-1ym16s2::attr(href)').get()),
                'image_url': product.css('img::attr(src)').get()
            }

        # Manejo de la paginación
        next_page = response.css('a[rel="next"]::attr(href)').get()
        if next_page:
            yield response.follow(next_page, self.parse)
