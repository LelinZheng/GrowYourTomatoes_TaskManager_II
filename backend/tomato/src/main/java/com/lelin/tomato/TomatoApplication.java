package com.lelin.tomato;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TomatoApplication {

	public static void main(String[] args) {
		SpringApplication.run(TomatoApplication.class, args);
	}

}
