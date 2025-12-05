# ---- BUILD STAGE ----
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src

# new jar
RUN mvn clean package -DskipTests -B

# ---- RUNTIME STAGE ----
FROM eclipse-temurin:21-jdk

WORKDIR /app

# jar von build
COPY --from=build /app/target/*.jar app.jar

# Crea cartella dati per H2 (persistente nel container)
RUN mkdir -p /app/data

# Port
EXPOSE 8080

# App Start
ENTRYPOINT ["java", "-jar", "app.jar"]
