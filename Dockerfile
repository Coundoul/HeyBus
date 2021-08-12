FROM openjdk:8-jdk-alpine

RUN apk update && apk add maven

COPY . /project
WORKDIR /project
RUN mvn package

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom", "-Dblabla", "-jar","/project/target/heybus-0.0.1.jar"]
