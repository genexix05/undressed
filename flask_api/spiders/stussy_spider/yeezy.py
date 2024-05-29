import scrapy
import re

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
