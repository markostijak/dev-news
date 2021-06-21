FROM openjdk:16.0.1-slim

ARG JAR

ADD target/${JAR} /app/application.jar

ENTRYPOINT ["java", "--enable-preview", "-jar", "/app/application.jar"]
