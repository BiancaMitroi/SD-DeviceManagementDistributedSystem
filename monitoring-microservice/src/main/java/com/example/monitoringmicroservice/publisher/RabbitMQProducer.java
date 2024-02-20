package com.example.monitoringmicroservice.publisher;

import com.example.monitoringmicroservice.dto.SensorData;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
@Component
@RequiredArgsConstructor
public class RabbitMQProducer {

    @Value("${spring.rabbitmq.exchange.name}")
    private String exchange;

    @Value("${spring.rabbitmq.routing-key.name}")
    private String routingKey;

    private final RabbitTemplate amqpTemplate;

    private static final Logger LOGGER = LoggerFactory.getLogger(RabbitMQProducer.class);

    public void sendMessage(SensorData sensorData){
        amqpTemplate.convertAndSend(exchange, routingKey, sensorData);
    }
}
