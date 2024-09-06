import chromadb
from chromadb.utils import embedding_functions

# Configuración de Chroma DB (suponiendo que ya la tienes configurada)
chroma_client = chromadb.HttpClient()

# Listar todas las colecciones disponibles
collections = chroma_client.list_collections()

for collection in collections:
    print(f"Collection name: {collection.name}")


# Embedding function (asegúrate de usar la misma función de embeddings que usaste al cargar los datos)
sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction( model_name="all-MiniLM-L6-v2" )
# Conectar a la colección existente
collection_name = "embedded_categories"
collection = chroma_client.get_collection(name=collections[0].name)

# La frase que quieres buscar
query_text = "latigos"

# Generar el embedding de la frase de búsqueda
query_embedding = sentence_transformer_ef([query_text])

# Realizar la búsqueda
results = collection.query(
    query_embeddings=query_embedding,
    n_results=5  # Número de resultados que quieres obtener
)

print(collection.count())

# Mostrar los resultados
for result in results["ids"]:
    print(f"Resultado encontrado: {result}")
for result in results["distances"]:
    print(f"Resultado encontrado: {result}")
for result in results["metadatas"]:
    print(f"Resultado encontrado: {result}")
for result in results["documents"]:
    print(f"Resultado encontrado: {result}")
