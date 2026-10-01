package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class HelloControllerTest {

    @Test
    void testHelloDirectly() {
        HelloController controller = new HelloController();
        String response = controller.hello();
        assertEquals("Hello World!", response);
    }
}
