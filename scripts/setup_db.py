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

print(host)
print(user)
print(password)

# Conexión a la base de datos usando las variables de entorno
conexion = mysql.connector.connect(
    host="localhost",
    user=user,
    password=password
)


query_path = '../db/mysql.sql'

query = open(query_path, 'r', encoding="utf-8").read()

try:
    conexion.cmd_query_iter(query)
    conexion.commit()
except mysql.connector.Error as error:
    print(f"Error al insertar la publicación '{id}': {error}")
    conexion.rollback()


## Insertar usuario administrador
with open('admin_user.json', 'r', encoding="utf-8") as file:
    admin_data = json.load(file)

conexion.close()

conexion = mysql.connector.connect(
    host="localhost",
    user=user,
    password=password,
    database=os.getenv('MYSQL_DATABASE')
)
cursor = conexion.cursor()
query = """
    INSERT INTO Users (id, userName, password, email, state)
    VALUES (%s, %s, %s, %s, %s)
"""
values = (
    admin_data['id'],
    admin_data['userName'],
    admin_data['password'],
    admin_data['email'],
    admin_data['state']
)
try:
    cursor.execute(query, values)
    conexion.commit()
except mysql.connector.Error as error:
    print(f"Error al insertar el usuario administrador: {error}")
    conexion.rollback()

cursor.close()
conexion.close()