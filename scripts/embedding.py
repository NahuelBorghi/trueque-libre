import json
from sentence_transformers import SentenceTransformer

# Cargar el modelo de embeddings
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Ruta al archivo JSON con las categorías
input_json_path = 'categories.json'

# Leer el archivo JSON con las categorías
with open(input_json_path, 'r', encoding="utf-8") as file:
    categories = json.load(file)

# Generar embeddings para cada categoría
embedded_categories = []
for category in categories:
    embedding = model.encode(category)
    embedded_categories.append({"name": category, "embedding": embedding.tolist()})

# Ruta para guardar el archivo con los embeddings
output_json_path = 'embedded_categories.json'

# Guardar los embeddings en un nuevo archivo JSON
with open(output_json_path, 'w', encoding="utf-8") as outfile:
    json.dump(embedded_categories, outfile, ensure_ascii=False, indent=4)

print(f"Embeddings guardados en: {output_json_path}")
