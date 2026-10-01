package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
class HelloControllerTest {

    @Autowired
    private HelloController controller;

    @Autowired
    private AppConfigProperties properties;

    @Test
    void testDevProfileLoaded() {
        assertEquals("development", properties.getEnvironment());
        assertEquals("Hello from DEV Environment!", controller.hello());
        assertTrue(properties.isFeatureFlagEnabled());
        assertEquals(0.05, properties.getTaxRate());
        assertEquals(1, properties.getMaxRetries());
        assertEquals(5, properties.getTimeout().toSeconds());
        assertEquals(5, properties.getMaxFileSize().toMegabytes());
    }

    @Test
    void testConfigEndpointReturnsAllTypes() {
        Map<String, Object> config = controller.getConfig();
        assertNotNull(config);
        assertEquals("development", config.get("environment"));
        assertEquals("Hello from DEV Environment!", config.get("greeting"));
        assertEquals(true, config.get("featureFlagEnabled"));
        assertNotNull(config.get("allowedOrigins"));
        assertNotNull(config.get("metadata"));
        assertEquals(5L, config.get("timeoutSeconds"));
        assertEquals(5L, config.get("maxFileSizeMegabytes"));
    }
}
