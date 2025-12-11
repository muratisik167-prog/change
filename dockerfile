FROM nginx:alpine
# Dosyaları Nginx sunucusuna kopyala
COPY . /usr/share/nginx/html
EXPOSE 80
