# 1. Aşama: Çalışma zamanı (Runtime) - .NET 10 versiyonu
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

# 2. Aşama: İnşa etme (Build) - .NET 10 SDK versiyonu
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Önce .csproj dosyasını kopyalayıp paketleri (Nuget) indiriyoruz
COPY ["Perfume.csproj", "./"]
RUN dotnet restore "./Perfume.csproj"

# Kalan tüm kodları kopyala ve projeyi "Release" modunda derle
COPY . .
RUN dotnet build "Perfume.csproj" -c Release -o /app/build

# 3. Aşama: Yayımlama (Publish) - Gereksiz dosyaları atıp son hali oluşturur
FROM build AS publish
RUN dotnet publish "Perfume.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 4. Aşama: Son İmaj - Derlenmiş kodları hafif imajın içine atıp kapıyı kapatıyoruz
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Konteyner ayağa kalktığında çalışacak ana komut
ENTRYPOINT ["dotnet", "Perfume.dll"]