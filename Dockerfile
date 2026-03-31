FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Zoo.Api/Zoo.Api.csproj Zoo.Api/
RUN dotnet restore Zoo.Api/Zoo.Api.csproj

COPY Zoo.Api/ Zoo.Api/
RUN dotnet publish Zoo.Api/Zoo.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 10000
ENTRYPOINT ["sh", "-c", "dotnet Zoo.Api.dll --urls http://0.0.0.0:${PORT:-10000}"]
