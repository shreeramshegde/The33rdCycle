# Stage 1: Build JAR using Maven
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and package
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal, secure JRE 17 runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=build /app/target/*.jar app.jar

# Render forwards web traffic to the port defined in $PORT (default 8080)
ENV PORT=8080
EXPOSE 8080

# Run JVM with memory optimizations for low-resource cloud tiers
ENTRYPOINT ["sh", "-c", "java -Xms128m -Xmx384m -Dserver.port=${PORT} -jar app.jar"]
