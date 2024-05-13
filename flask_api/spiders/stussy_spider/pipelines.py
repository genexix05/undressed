import mysql.connector
from mysql.connector import Error

class StussyProductsPipeline:
    def open_spider(self, spider):
        try:
            self.connection = mysql.connector.connect(
                host='127.0.0.1',  # Asegúrate de configurar estos parámetros correctamente
                user='root',
                passwd='',
                database='undressed'
            )
            if self.connection.is_connected():
                print("Conexión establecida a la base de datos.")
                self.cursor = self.connection.cursor()
        except Error as e:
            print("Error al conectar a la base de datos:", e)

    def close_spider(self, spider):
        try:
            if self.connection.is_connected():
                self.cursor.close()
                self.connection.close()
                print("Conexión a la base de datos cerrada.")
        except Error as e:
            print("Error al cerrar la conexión a la base de datos:", e)

    def process_item(self, item, spider):
        sql_query = '''
            INSERT INTO products (name, url, price, image_urls, sizes) VALUES (%s, %s, %s, %s, %s)
        '''
        values = (
            item.get('name'),
            item.get('url'),
            item.get('price'),
            ','.join(item.get('image_urls')),  # Convertir lista a string
            ','.join(item.get('sizes'))  # Convertir lista a string
        )
        try:
            self.cursor.execute(sql_query, values)
            self.connection.commit()
            print("Datos insertados correctamente en la base de datos: ", values)
        except Error as e:
            print("Error al insertar datos en la base de datos:")
            print("SQL Query: ", sql_query)
            print("Values: ", values)
            print("MySQL Error: ", e)
        return item
