from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from scrapy import Spider
from scrapy.selector import Selector
import time

class PalaceSpiderSelenium(Spider):
    name = 'palace_selenium'
    start_urls = ['https://shop-eu.palaceskateboards.com/']

    def __init__(self):
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Configura Chrome para correr en modo headless
        chrome_options.add_argument("--window-size=1920x1080")  # Define el tamaño de la ventana
        chrome_options.add_argument("--disable-gpu")  # A veces necesario para evitar errores en algunos sistemas
        chrome_options.add_argument("--no-sandbox")  # Bypass OS security model
        self.driver = webdriver.Chrome(options=chrome_options)

    def parse(self, response):
        self.driver.get(response.url)
        
        # Simula el scroll hacia abajo para cargar más productos
        last_height = self.driver.execute_script("return document.body.scrollHeight")
        while True:
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(3)  # Ajusta este tiempo según la velocidad de carga del sitio
            new_height = self.driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

        sel = Selector(text=self.driver.page_source)
        products = sel.css('a[aria-label^="product-card"]')
        for product in products:
            yield {
                'name': product.css('h3::text').get(),
                'price': product.css('div[data-testid="price-label"] div::text').get(),
                'link': response.urljoin(product.css('::attr(href)').get()),
                'image_url': product.css('img::attr(src)').get()
            }

        self.driver.close()

    def closed(self, reason):
        self.driver.quit()
