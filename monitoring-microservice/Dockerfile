FROM maven:3.8.7-openjdk-18-slim AS builder

WORKDIR /root
COPY ./src/ ./src
COPY ./pom.xml ./

RUN mvn clean install -DskipTests
ADD ./target/monitoring-microservice-0.0.1-SNAPSHOT.jar /developments/
ENTRYPOINT ["java","-jar","/developments/monitoring-microservice-0.0.1-SNAPSHOT.jar"]
RUN java -Djarmode=layertools -jar /root/target/monitoring-microservice-0.0.1-SNAPSHOT.jar extract

FROM openjdk:22-slim

ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASSWORD=root
ENV DB_DBNAME=sensors

COPY --from=builder /root/dependencies/ ./
COPY --from=builder /root/snapshot-dependencies/ ./

COPY --from=builder /root/spring-boot-loader/ ./
COPY --from=builder /root/application/ ./
ENTRYPOINT ["java", "org.springframework.boot.loader.JarLauncher","-XX:+UseContainerSupport -XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XX:MaxRAMFraction=1 -Xms512m -Xmx512m -XX:+UseG1GC -XX:+UseSerialGC -Xss512k -XX:MaxRAM=72m"]