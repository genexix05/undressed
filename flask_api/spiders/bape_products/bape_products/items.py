# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy

class BapeProductItem(scrapy.Item):
    product_id = scrapy.Field()
    name = scrapy.Field()
    price = scrapy.Field()
    description = scrapy.Field()
    image_urls = scrapy.Field()
    product_url = scrapy.Field()
    sizes = scrapy.Field()

