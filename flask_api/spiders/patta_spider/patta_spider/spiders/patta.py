import scrapy
import re


class PattaSpider(scrapy.Spider):
    name = 'patta_spider'
    allowed_domains = ['patta.nl']
    start_urls = [
        'https://www.patta.nl/search?q=all&type=product&options[unavailable_products]=hide']

    def parse(self, response):
        for product in response.css('li.grid__item--template--19717885100363__search-page'):
            yield {
                'name': product.css('div[data-product-item]::attr(data-product-title)').get().strip(),
                'id': product.css('div[data-product-item]::attr(data-id)').get(),
                'product_url': response.urljoin(product.css('a::attr(href)').get()),
                'image_url': response.urljoin(product.css('img::attr(src)').get(default='')),
                'price': self.clean_price(product.css('span.text-red::text, span.text-bodyText::text').get()),
                'regular_price': self.clean_price(product.css('s.line-through::text, span.text-bodyText::text').get()),
                'sale_tag': product.css('span.bg-red span::text, span.bg-black span::text').get(),
            }

        # Gestión de la paginación
        current_page = response.url.split(
            '&page=')[-1] if '&page=' in response.url else 1
        next_page = int(current_page) + 1
        next_page_url = f"https://www.patta.nl/search?q=all&type=product&options[unavailable_products]=hide&page={next_page}"

        # Verificar si hay más páginas mirando si hay productos en la siguiente página o algún otro indicador
        # O cualquier otro indicador adecuado
        if response.css('li.grid__item--template--19717885100363__search-page'):
            yield response.follow(next_page_url, self.parse)

    def clean_price(self, price):
        if price:
            return re.sub(r'\s+', '', price)
        return price
