# 1. Base: Usaremos una versión estable y pequeña de Node.js.
FROM node:20-alpine

# 2. Carpeta de trabajo: Entraremos en una carpeta dentro del contenedor.
WORKDIR /usr/src/app

# 3. Instalación: Copia el archivo de ingredientes e instálalos.
COPY package*.json ./
RUN npm install --omit=dev

# 4. Código: Copia el archivo server.js (y cualquier otro código).
COPY . .

# 5. Puerto: Informamos que la app usará el puerto 3000 si no se especifica otro.
EXPOSE 3000

# 6. Inicio: Comando para arrancar el servidor.
CMD [ "npm", "start" ]
