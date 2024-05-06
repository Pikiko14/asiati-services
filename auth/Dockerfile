FROM node:20

# Establece el directorio de trabajo
WORKDIR /home/asiati/auth

# Copia los archivos de la aplicación al contenedor
COPY ./ .

# Copia el script de espera (validar en linux)
# COPY wait-for-rabbitmq.sh /usr/local/bin/
# RUN chmod +x /usr/local/bin/wait-for-rabbitmq.sh

# Instala las dependencias
RUN npm install

# Expone el puerto 3000
EXPOSE 3000

# Comando para ejecutar el script de espera y luego la aplicación en modo de desarrollo
CMD ["npm", "run", "dev"]
