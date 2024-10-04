import json
import re

# Función para cargar categorías desde categories.json
def cargar_categorias(archivo):
    with open(archivo, 'r', encoding='utf-8') as f:
        return json.load(f)

# Lista de palabras específicas a filtrar
palabras_especificas = [
    'para', 'de', 'por', 'con', 'y', 'del', 'en', 'a', 
    'el', 'la', 'los', 'las', 'manual', 'industriales', 
    'nauticos', 'agrícolas', 'vehicular', 'vehiculares', 
    'alimentador', 'test', 'prueba', 'pruebas', 'prueba',
    # Agrega más palabras clave que consideres indicativas de una categoría específica
]

# Función para verificar si una categoría es demasiado específica
def es_categoria_especifica(categoria):
    # Podrías ajustar el criterio de lo que consideras una categoría "demasiado específica".
    palabras = re.findall(r'\b\w+\b', categoria.lower())
    return any(palabra in palabras_especificas for palabra in palabras)

# Función para filtrar las categorías
def filtrar_categorias(categorias):
    categorias_filtradas = []
    categorias_unicas = set()

    for categoria in categorias:
        # Pasar la categoría a minúsculas para evitar duplicados con mayúsculas/minúsculas diferentes
        cat_normalizada = categoria.lower().strip()

        # Filtrar categorías demasiado específicas
        if es_categoria_especifica(cat_normalizada):
            continue
        elif cat_normalizada.endswith(' - test') or cat_normalizada.endswith('- test'):
            continue

        # Agregar categoría si no está en el set de únicas
        if cat_normalizada not in categorias_unicas:
            categorias_unicas.add(cat_normalizada)
            categorias_filtradas.append(categoria)  # Conservar formato original

    return categorias_filtradas

# Función principal
def main():
    archivo = 'categories.json'
    categorias = cargar_categorias(archivo)
    categorias_filtradas = filtrar_categorias(categorias)

    print("Categorías filtradas :D")

    # Si deseas guardar el resultado en un archivo JSON
    with open('categorias_filtradas.json', 'w', encoding='utf-8') as f:
        json.dump(categorias_filtradas, f, ensure_ascii=False, indent=4)

if __name__ == '__main__':
    main()
