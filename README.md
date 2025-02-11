# Instalacion en Dev

1. Clonar el repositorio
2. Instalar dependencias  "npm unstall"
3. crear archivo .env basado en el .env.template
4. Ejecutar 'npm run start:dev"

# Pasos para crear nuevas rutas o consultas.
1.- (Paso 1.) Crear nueva función dentro del controlador.
2.- (Paso 2 )Crear archivo en DTO (dtos/pros-const-discusser.dto) con su respectivo nombre (Paso 2.) Luego se exporta del index.ts
3.- Actualizar los nombres de los componentes que se puso en el paso 1 y 2, solo se jala los componentes.
4.- (Paso 3) Se crea en el archivo gpt.services y se pone el metodo con los nombres respectivos.
5.- (Paso 4 ) Se crea el caso de uso en la carpeta use-case. Aqui estara el modelo de openai. No olvidar exportar al index.