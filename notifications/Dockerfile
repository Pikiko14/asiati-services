FROM node:20

# Establece el directorio de trabajo
WORKDIR /home/asiati/notifications

# Copia los archivos de la aplicación al contenedor
COPY ./ .

# Instala las dependencias
RUN npm install

#Instala node ts
RUN npm install -g ts-node

# Comando para ejecutar la aplicación en modo de desarrollo
CMD ["npm", "run", "dev"]
