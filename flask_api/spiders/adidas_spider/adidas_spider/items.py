# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy

class AdidasProductItem(scrapy.Item):
    id = scrapy.Field()
    name = scrapy.Field()
    color = scrapy.Field()
    modelId = scrapy.Field()
    price = scrapy.Field()
    salePrice = scrapy.Field()
    link = scrapy.Field()
    images = scrapy.Field()
    image_urls = scrapy.Field()

