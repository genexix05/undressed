from scrapy import Spider
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time

class AmiriSeleniumScrollSpider(Spider):
    name = 'amiri'
    allowed_domains = ['amiri.com']
    start_urls = ['https://amiri.com/en-es/collections/all']

    def __init__(self):
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        # Configura el User-Agent para imitar un navegador regular
        chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36")
        self.driver = webdriver.Chrome(options=chrome_options)

    def parse(self, response):
        self.driver.get(response.url)
        time.sleep(5)  # Espera inicial después de cargar la página

        last_height = self.driver.execute_script("return document.body.scrollHeight")
        attempts = 0
        while attempts < 3:  # Intenta un número limitado de veces
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(5)  # Espera más larga para asegurar la carga
            new_height = self.driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                attempts += 1
            else:
                attempts = 0
            last_height = new_height

        # Extrae los productos
        products = self.driver.find_elements(By.CSS_SELECTOR, "li.grid__item")
        for product in products:
            yield {
                'name': product.find_element(By.CSS_SELECTOR, 'div.product-card__title a').text.strip(),
                'price': product.find_element(By.CSS_SELECTOR, 'span.price-item--regular').text.strip(),
                'image_url': product.find_element(By.CSS_SELECTOR, 'picture img').get_attribute('src'),
                'product_url': product.find_element(By.CSS_SELECTOR, 'div.product-card__title a').get_attribute('href')
            }

        self.driver.quit()
