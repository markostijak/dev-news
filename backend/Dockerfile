FROM openjdk:13.0.1

ARG JAR

ADD target/${JAR} /app/application.jar

ENTRYPOINT ["java", "--enable-preview", "-jar", "/app/application.jar"]
