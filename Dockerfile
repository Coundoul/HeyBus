FROM ubuntu:20.04

RUN apt-get update
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get install -y openjdk-8-jdk && apt-get install -y maven
RUN export JAVA_HOME="/usr/lib/jvm/jdk1.8.0_281/jre"

RUN apt-get install -y nodejs
RUN apt-get install -y npm

COPY . /project
WORKDIR /project
RUN mvn package

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom", "-Dblabla", "-jar","/project/target/heybus-0.0.1.jar"]
