import chromadb
from chromadb.utils import embedding_functions
import json
import uuid
from tqdm import tqdm

import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

# Configuración de Chroma DB
chroma_client = chromadb.HttpClient()

sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction( model_name="all-MiniLM-L6-v2" )

# Nombre de la colección
collection_name = "embedded_categories"

# Leer el archivo JSON con los embeddings
input_json_path = 'embedded_categories.json'
with open(input_json_path, 'r', encoding="utf-8") as file:
    embedded_categories = json.load(file)

# Crear la colección en ChromaDB (o conectarse si ya existe)
try:
    collection = chroma_client.get_or_create_collection(
        name=collection_name,
        embedding_function=sentence_transformer_ef,
    )
except chromadb.errors.CollectionAlreadyExists:
    collection = chroma_client.get_collection(name=collection_name)

# Cargar los embeddings a ChromaDB
total_embeddings = len(embedded_categories)
with tqdm(embedded_categories, desc="Cargando embeddings", total=total_embeddings) as progress_bar:
    for category in progress_bar:
        category_id = str(uuid.uuid4())
        document = category["name"]
        embedding = category["embedding"]

        # Añadir el embedding a la colección
        try:
            collection.add(
                ids=category_id,
                documents=[document],
                embeddings=[embedding]
            )
        except Exception as e:
            print(f"Error al agregar el embedding de '{document}': {e}")
        else:
            progress_bar.set_description(f"Cargando embedding: {document}")

print(f"Embeddings cargados en la colección '{collection_name}' correctamente.")
print(f"Total de documentos en la colección: {collection.count()}")