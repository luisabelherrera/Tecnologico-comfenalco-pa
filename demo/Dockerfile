# Use an official OpenJDK runtime as a parent image with Java 22
FROM openjdk:22-jdk-slim AS build

# Set the working directory in the container
WORKDIR /app

# Copy the Maven POM file
COPY pom.xml .

# Copy the local weka.jar file (assuming it's in the lib directory)
COPY lib/weka.jar /app/lib/weka.jar

# Copy the source code
COPY src ./src

# Install Maven and build the application
RUN apt-get update && apt-get install -y maven \
    && mvn clean package -DskipTests

# Second stage: create the runtime image
FROM openjdk:22-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/demo-0.0.1-SNAPSHOT.jar app.jar

# Expose the default Spring Boot port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]