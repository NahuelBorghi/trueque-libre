import mysql.connector
import uuid
import os
import json
from pathlib import Path
from dotenv import load_dotenv

# Carga el archivo .env un nivel más arriba del directorio del script
env_path = Path('../') / '.env'
load_dotenv(dotenv_path=env_path)

# Obtiene las variables de entorno
host = os.getenv('MYSQL_HOST')
user = os.getenv('DATABASE_USER')
password = os.getenv('DATABASE_PASSWORD')
database = os.getenv('MYSQL_DATABASE')

# Conexión a la base de datos usando las variables de entorno
conexion = mysql.connector.connect(
    host="localhost",
    user=user,
    password=password,
    database=database
)

cursor = conexion.cursor()

# Ruta al archivo JSON con las categorías
input_json_path = 'categorias_filtradas.json'

# Leer el archivo JSON con las categorías
with open(input_json_path, 'r', encoding="utf-8") as file:
    categories = json.load(file)


# Función para insertar datos en la tabla tags
def insertar_tag(tagName):
    try:
        if len(tagName) > 100:
            raise ValueError("El tagName no puede tener más de 100 caracteres")
        
        id = str(uuid.uuid4())  # Genera un UUID v4

        query = "INSERT INTO Tags (id, tagName) VALUES (%s, %s)"
        valores = (id, tagName)

        cursor.execute(query, valores)
        conexion.commit()
        # print(f"Tag '{tagName}' insertado con id {id}")
    except mysql.connector.Error as error:
        print(f"Error al insertar el tag '{tagName}': {error}")
        conexion.rollback()

# Ejemplo de uso
try:
    for category in categories:
        insertar_tag(category)
finally:
    cursor.close()
    conexion.close()
