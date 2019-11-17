FROM openjdk:13.0.1

ARG JAR

ADD target/${JAR} /app/application.jar

ENTRYPOINT ["java", "--enable-preview", "-parameters", "-jar", "/app/application.jar"]
