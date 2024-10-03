import mysql.connector
import uuid
import os
import json
import datetime
from pathlib import Path
from dotenv import load_dotenv

# Carga el archivo .env un nivel más arriba del directorio del script
env_path = Path('./') / '.env'
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

input_json_path = 'publications.json'

with open(input_json_path, 'r', encoding="utf-8") as file:
    publications = json.load(file)


def insertar_publication(publication):
    try:
        id = str(uuid.uuid4())  # Genera un UUID v4

        query = """
            INSERT INTO Publications (id, title, description, state, status, creationDate, creationUser, ubication, exchange)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        valores = (
            id,
            publication["title"],
            publication["description"],
            publication["state"],
            publication["status"],
            datetime.date.today(),
            publication["creationUser"],
            publication["ubication"],
            publication["exchange"], 
        )

        cursor.execute(query, valores)
        conexion.commit()
        print(f"Tag '{publication["title"]}' insertado con id {id}")
    except mysql.connector.Error as error:
        print(f"Error al insertar la publicación '{id}': {error}")
        conexion.rollback()

# Ejemplo de uso
try:
    for publication in publications:
        insertar_publication(publication)
finally:
    cursor.close()
    conexion.close()