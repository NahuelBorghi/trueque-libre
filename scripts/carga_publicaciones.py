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


def insertar_publication(publication, index):
    try:
        id = str(uuid.uuid4())  # Genera un UUID v4

        query = """
            INSERT INTO Publications (id, title, description, state, status, creationDate, creationUser, ubication, exchange)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        valores = (
            id,
            publication["title"] + f"{index}",
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
        return id
    except mysql.connector.Error as error:
        print(f"Error al insertar la publicación '{id}': {error}")
        conexion.rollback()
        
def insertar_tag_en_publication(publication_id, tag_id):
    try:
        query = """
            INSERT INTO TagPublication (idTags, Publications_id)
            VALUES (%s, %s)
        """
        
        valores = (tag_id, publication_id)

        cursor.execute(query, valores)
        conexion.commit()
        print(f"Tag '{tag_id}' insertado en la publicación '{publication_id}'")
    except mysql.connector.Error as error:
        print(f"Error al insertar el tag '{tag_id}' en la publicación '{publication_id}': {error}")
        conexion.rollback()
        
def get_all_categories():
    query = "SELECT * FROM Tags"
    cursor.execute(query)
    return cursor.fetchall()

# Ejemplo de uso
try:
    i = 0
    categories = get_all_categories()
    for publication in publications:
        random_category = categories[i % len(categories)]
        id = insertar_publication(publication, i)
        insertar_tag_en_publication(id, random_category[0])
        i += 1
finally:
    cursor.close()
    conexion.close()