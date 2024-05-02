import mysql.connector

class StussyProductsPipeline:
    def open_spider(self, spider):
        self.connection = mysql.connector.connect(
            host='localhost',  # Asegúrate de configurar estos parámetros correctamente
            user='root',
            passwd='',
            database='undressed'
        )
        self.c = self.connection.cursor()

    def close_spider(self, spider):
        self.c.close()
        self.connection.close()

    def process_item(self, item, spider):
        self.c.execute('''
            INSERT INTO products (name, url, price, image_urls, sizes) VALUES (%s, %s, %s, %s, %s)
        ''', (
            item.get('name'),
            item.get('url'),
            item.get('price'),
            ','.join(item.get('image_urls')),  # Convertir lista a string
            ','.join(item.get('sizes'))  # Convertir lista a string
        ))
        self.connection.commit()
        return item
