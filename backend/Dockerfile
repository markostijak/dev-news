FROM openjdk:12.0.2

ARG JAR

ADD target/${JAR} /app/application.jar

ENTRYPOINT ["java", "-jar", "/app/application.jar"]
