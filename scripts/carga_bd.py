import mysql.connector
import uuid
import os
import json
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime
import bcrypt
import random
import mimetypes
import requests

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
        userName = user["userName"]
        password = user["password"]
        email = user["email"]
        data = {
            "userName": userName,
            "password": str(password),
            "email": email
        }
        data = json.dumps(data)
        print(data)
        response = requests.post("http://localhost:8080/user/register", data=data, headers={"Content-Type": "application/json"})
        # Verificar la respuesta
        if response.status_code == 201:
            print(f"Usuario {userName} insertado correctamente: {response.json()}")
        else:
            print(f"Error al insertar el usuario {userName}: {response.status_code} - {response.text}")
        print(f'Usuario "{user["userName"]}"')
    except mysql.connector.Error as error:
        print(f'Error al insertar el usuario "{user["userName"]}": {error}')
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
        arrayCategorie.insert(0, categorieDB[0][0])
    return ','.join(arrayCategorie)

def insertar_publications(publication):
    try:
        indexRandom = random.randint(0, len(usersBD) - 1)
        userId = usersBD[indexRandom]["id"]
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
        print(f'Publicación "{publication["title"]}" insertado con id {idPublication}')

        queryTags = "INSERT INTO TagPublication (Publications_id, idTags) VALUES (%s, %s)"
        valoresTags = (idPublication, idCategorie,)

        cursor.execute(queryTags, valoresTags)
        conexion.commit()
        print(f'Tag "{idCategorie}" relacionado con publicación {publication["title"]}')
        
        print(publication["imagenes"])
        url = "http://localhost:8080/image/upload"
        for image in publication["imagenes"]:
            try:
                # Ruta completa del archivo
                imagePath = f"images/{image}"

                # Detectar el tipo MIME del archivo
                mime_type, _ = mimetypes.guess_type(imagePath)

                # Validar tipo MIME
                if mime_type not in ['image/jpeg', 'image/png']:
                    print(f"Tipo de archivo no válido: {image} ({mime_type})")
                    continue

                # Abrir el archivo como binario
                with open(imagePath, 'rb') as file:
                    # Crear el formulario de datos
                    files = {'file': (image, file, mime_type)}  # Nombre del campo 'file'
                    params = {
                        'publicationId': idPublication,  # Cambiado para coincidir con el backend
                        'idUser': userId,
                    }

                    # Realizar la solicitud POST
                    response = requests.post(url, files=files, params=params)

                    # Verificar la respuesta
                    if response.status_code == 201:
                        print(f"Imagen {image} subida correctamente: {response.json()}")
                    else:
                        print(f"Error al subir la imagen {image}: {response.status_code} - {response.text}")
            except FileNotFoundError:
                print(f"Archivo no encontrado: {image}")
            except Exception as e:
                print(f"Error inesperado al procesar la imagen {image}: {e}")
            # file_path = "images/" + imagen  # Ruta original del archivo
            # if not os.path.exists(file_path):
            #     print(f'Error: El archivo "{file_path}" no existe.')
            #     continue  # Salta al siguiente archivo si no existe

            # queryImage = "INSERT INTO Image (id, image, mimetype, creationDate, creationUser) VALUES (%s, %s, %s, %s, %s)"
            # idImage = str(uuid.uuid4())
            # valoresImage = (idImage, "", "image/jpg", datetime.now().strftime('%Y-%m-%d %H:%M:%S'), userId,)
            
            # cursor.execute(queryImage, valoresImage)
            # conexion.commit()
            # print(f'Imagen "{imagen}" insertado con id {idImage}')
            
            # queryImagesRelation = "INSERT INTO ImagePublication (id, idPublication, idUser, idImage) VALUES (%s, %s, %s, %s)"
            # valoresImagesRelation = (str(uuid.uuid4()), idPublication, userId, idImage,)

            # cursor.execute(queryImagesRelation, valoresImagesRelation)
            # conexion.commit()
            # print(f'Imagen "{imagen}" relacionado con publicación {publication["title"]}')
            
            # # Copiar la imagen al directorio destino
            # destination_dir = f"../backend/images/{userId}/"  # Ruta destino
            # os.makedirs(destination_dir, exist_ok=True)  # Crear el directorio si no existe
            
            # destination_path = os.path.join(destination_dir, imagen)  # Ruta completa de destino
            # shutil.copy(file_path, destination_path)  # Copiar el archivo
            # print(f'Imagen "{imagen}" copiada a {destination_path}')

    except mysql.connector.Error as error:
        print(f'Error al insertar la publicacion "{publication["title"]}": {error}')

# Ejemplo de uso
try:
    for publication in publications:
        insertar_publications(publication)
except mysql.connector.Error as error:
    print("error insertar_publications", error)

cursor.close()
conexion.close()


