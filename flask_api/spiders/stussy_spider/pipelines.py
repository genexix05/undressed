import mysql.connector
from mysql.connector import Error

class StussyProductsPipeline:
    def open_spider(self, spider):
        try:
            self.connection = mysql.connector.connect(
                host='127.0.0.1',
                user='root',
                passwd='',
                database='undressed'
            )
            if self.connection.is_connected():
                spider.logger.info("Conexión establecida a la base de datos.")
                self.cursor = self.connection.cursor()
        except Error as e:
            spider.logger.error("Error al conectar a la base de datos: %s", e)

    def close_spider(self, spider):
        try:
            if self.connection.is_connected():
                self.cursor.close()
                self.connection.close()
                spider.logger.info("Conexión a la base de datos cerrada.")
        except Error as e:
            spider.logger.error("Error al cerrar la conexión a la base de datos: %s", e)

    def process_item(self, item, spider):
        if not item.get('category'):
            spider.logger.warning(f"Skipping item due to missing category: {item}")
            return item

        sql_query = '''
            INSERT INTO products (name, url, price, image_urls, sizes) VALUES (%s, %s, %s, %s, %s)
        '''
        values = (
            item.get('name'),
            item.get('url'),
            item.get('price'),
            ','.join(item.get('image_urls')),  # Convertir lista a string
            ','.join(item.get('sizes'))
        )
        try:
            self.cursor.execute(sql_query, values)
            self.connection.commit()
            spider.logger.info("Datos insertados correctamente en la base de datos: %s", values)
        except Error as e:
            spider.logger.error("Error al insertar datos en la base de datos:")
            spider.logger.error("SQL Query: %s", sql_query)
            spider.logger.error("Values: %s", values)
            spider.logger.error("MySQL Error: %s", e)
        return item
