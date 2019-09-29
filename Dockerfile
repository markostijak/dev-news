FROM openjdk:13

ARG JAR

ADD backend/target/${JAR} /app/application.jar

ENTRYPOINT ["java", "--enable-preview", "-parameters", "-jar", "/app/application.jar"]
