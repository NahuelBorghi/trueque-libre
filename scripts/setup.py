import subprocess

# scripts = ['setup_db.py', 'carga_publicaciones.py'] 
# scripts = ['carga_tags_mysql.py']  
scripts = ['setup_db.py', 'carga_tags_mysql.py', 'carga_bd.py']  
# scripts = ['carga_bd.py']  

for script in scripts:
    try:
        # Ejecutar el script
        result = subprocess.run(['python', script], check=True)
        print(f'{script} ejecutado con éxito')
    except subprocess.CalledProcessError as e:
        print(f'Error al ejecutar {script}: {e}')
        break
