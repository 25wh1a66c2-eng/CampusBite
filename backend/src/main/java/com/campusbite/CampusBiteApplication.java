package com.campusbite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CampusBiteApplication {

    public static void main(String[] args) {
        SpringApplication.run(CampusBiteApplication.class, args);
        System.out.println("==================================================");
        System.out.println(" CampusBite Backend running on port 8080! ");
        System.out.println(" REST API available at http://localhost:8080/api  ");
        System.out.println("==================================================");
    }
}
