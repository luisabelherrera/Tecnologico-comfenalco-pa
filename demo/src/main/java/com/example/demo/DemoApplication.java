package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableCaching
@EnableAspectJAutoProxy // habilita  aspectos   interceptores  ejemplo  transacciones  logging
@EnableJpaRepositories(basePackages = "com.example.demo.repositories.jpa")
@EnableMongoRepositories(basePackages = "com.example.demo.repositories.mongo")
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

}
