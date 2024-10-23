FROM openjdk:17-jdk-alpine
LABEL authors="abel herrera"
COPY target/demo-0.0.1-SNAPSHOT.jar java-app.jar
ENTRYPOINT ["java", "-jar", "java-app.jar"]