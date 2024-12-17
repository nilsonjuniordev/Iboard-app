# Etapa de construção
FROM node:14 AS frontend-builder

WORKDIR /app/frontend
COPY package*.json ./
RUN npm install
COPY . . 
RUN npm run build

# Etapa final
FROM nginx:latest AS frontend-runtime

# Remove o arquivo de configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia o arquivo de configuração customizado para o contêiner
COPY nginx.conf /etc/nginx/conf.d/

# Copia os arquivos de build do aplicativo React para o diretório de HTML do Nginx
COPY --from=frontend-builder /app/frontend/build /usr/share/nginx/html

# Expose a porta 3001 para o tráfego HTTP, que é a porta padrão do Nginx
EXPOSE 3001
