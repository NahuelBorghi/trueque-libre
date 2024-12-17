import mysql.connector
import uuid
import os
import json
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime
import bcrypt
import random

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
usersPath = 'users.json'
publicationsPath = 'principalPublications.json'

# Leer el archivo JSON con las categorías
with open(publicationsPath, 'r', encoding="utf-8") as file:
    publications = json.load(file)

with open(usersPath, 'r', encoding="utf-8") as file:
    users = json.load(file)

# Función para insertar datos en la tabla tags
def insertar_user(user):
    try:
        id = str(uuid.uuid4())  # Genera un UUID v4
        salt = bcrypt.gensalt()
        # Crear el hash de la contraseña
        hashed_password = bcrypt.hashpw(user["password"].encode('utf-8'), salt)


        query = "INSERT INTO Users (id, userName, password, email, state) VALUES (%s, %s, %s, %s, %s)"
        valores = (id, user["userName"], hashed_password, user["email"], user["state"])

        cursor.execute(query, valores)
        conexion.commit()
        print(f"Usuario '{user["userName"]}' insertado con id {id}")
    except mysql.connector.Error as error:
        print(f"Error al insertar el usuario '{user["userName"]}': {error}")
        conexion.rollback()

# Ejemplo de uso
try:
    for user in users:
        insertar_user(user)
except:
    print("error insertar_user")


cursor.execute("SELECT * FROM Users")
# Obtener los nombres de las columnas
column_names = [description[0] for description in cursor.description]
# Obtener los resultados
rows = cursor.fetchall()
# Transformar las filas en una lista de diccionarios
usersBD = [dict(zip(column_names, row)) for row in rows]

def get_categories(categories):
    arrayCategorie = []
    for categorie in categories:
        cursor.execute("SELECT * FROM Tags WHERE tagName = %s", (categorie,))
        categorieDB = cursor.fetchall()
        arrayCategorie.insert(0, categorieDB[0][0].decode("utf-8"))
    return ','.join(arrayCategorie)

def insertar_publications(publication):
    try:
        indexRandom = random.randint(0, len(usersBD) - 1)
        userId = usersBD[indexRandom]["id"].decode('utf-8')
        idCategorie = get_categories(publication["tags"])
        idPublication = str(uuid.uuid4())  # Genera un UUID v4

        queryPublications = "INSERT INTO Publications (id, title, description, state, status, ubication, exchange, creationDate, creationUser, modificationDate, modificationUser) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        valoresPublications = (
            idPublication,
            publication["title"],
            publication["description"],
            publication["state"],
            publication["status"],
            publication["ubication"],
            publication["exchange"],
            datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            userId,
            None,
            None,
        )

        cursor.execute(queryPublications, valoresPublications)
        conexion.commit()
        print(f"Publicación '{publication["title"]}' insertado con id {idPublication}")

        queryTags = "INSERT INTO TagPublication (Publications_id, idTags) VALUES (%s, %s)"
        valoresTags = (idPublication, idCategorie,)

        cursor.execute(queryTags, valoresTags)
        conexion.commit()
        print(f"Tag '{idCategorie}' relacionado con publicación {publication["title"]}")

        queryTags = "INSERT INTO TagPublication (Publications_id, idTags) VALUES (%s, %s)"
        valoresTags = (idPublication, idCategorie,)

        cursor.execute(queryTags, valoresTags)
        conexion.commit()
        print(f"Tag '{idCategorie}' relacionado con publicación {publication["title"]}")
    except mysql.connector.Error as error:
        print(f"Error al insertar la publicacion '{publication["title"]}': {error}")

# Ejemplo de uso
try:
    for publication in publications:
        insertar_publications(publication)
except mysql.connector.Error as error:
    print("error insertar_publications", error)

cursor.close()
conexion.close()


