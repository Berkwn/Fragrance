# 1. Aşama: İnşa etme (Build) - Uygulamayı yayına hazırlar
FROM node:18-alpine AS build
WORKDIR /app

# Sadece bağımlılık listesini kopyalayıp paketleri kuruyoruz (Hız kazandırır)
COPY package*.json ./
RUN npm install

# Kalan tüm dosyaları (src, public vb.) kopyalayıp derliyoruz
COPY . .
RUN npm run build

# 2. Aşama: Sunum (Production) - Derlenmiş dosyaları Nginx ile yayınlar
FROM nginx:alpine AS final
WORKDIR /usr/share/nginx/html

# Nginx'in içindeki varsayılan HTML dosyalarını siliyoruz
RUN rm -rf ./*

# 1. aşamada derlenen dosyaları Nginx'in yayın klasörüne kopyalıyoruz
# ÖNEMLİ: Eğer projeyi Vite ile kurduysan alt satırdaki /app/build kısmını /app/dist olarak değiştir!
COPY --from=build /app/build .

# Nginx 80 portundan dışarıya yayın yapar
EXPOSE 80

# Nginx'i sürekli çalışır halde tutar
ENTRYPOINT ["nginx", "-g", "daemon off;"]