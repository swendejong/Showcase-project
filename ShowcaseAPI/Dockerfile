# Base image for runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy project file and restore dependencies
# Adjust the path based on the location of ShowcaseAPI.csproj
COPY Showcase-project/ShowcaseAPI/ShowcaseAPI.csproj .

RUN dotnet restore ShowcaseAPI.csproj

# Copy the rest of the project files
COPY . .

RUN dotnet build ShowcaseAPI.csproj -c $BUILD_CONFIGURATION -o /app/build

# Publish stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish ShowcaseAPI.csproj -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
CMD ["dotnet", "ShowcaseAPI.dll"]
