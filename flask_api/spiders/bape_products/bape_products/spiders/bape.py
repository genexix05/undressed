import scrapy
from bape_products.items import BapeProductItem

class BapeSpider(scrapy.Spider):
    name = 'bape'
    allowed_domains = ['int.bape.com']
    start_urls = [
        'https://int.bape.com/bape/men/?prefn1=isHidden&prefv1=false&start=0&sz=48',
        'https://int.bape.com/bape/women/?prefn1=isHidden&prefv1=false&start=0&sz=48',
        'https://int.bape.com/bape/kids/?prefn1=isHidden&prefv1=false&start=0&sz=48'
    ]

    def parse(self, response):
        # Loop through each product tile
        for product in response.css('li.grid-tile'):
            item = BapeProductItem()
            item['product_id'] = product.css('div.product-tile::attr(data-itemid)').get().strip()
            item['name'] = product.css('div.product-name a::text').get().strip()
            item['price'] = product.css('span.product-sales-price::text').get().strip()
            item['description'] = product.css('div.product-description span::text').get().strip()
            item['image_urls'] = [url.strip() for url in product.css('a.thumb-link img::attr(data-src)').extract()]
            item['product_url'] = product.css('div.product-name a::attr(href)').get().strip()
            item['sizes'] = [size.strip() for size in product.css('div.product-size a::text').extract()]

            yield item
        
        # Pagination
        current_start = response.url.split('start=')[-1].split('&')[0]
        next_start = int(current_start) + 48
        next_page_url = response.urljoin(f'?prefn1=isHidden&prefv1=false&start={next_start}&sz=48')
        
        if next_start < 1000:  # Adjust based on expected total items
            yield scrapy.Request(next_page_url, callback=self.parse)
