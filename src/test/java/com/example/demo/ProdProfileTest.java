package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("prod")
class ProdProfileTest {

    @Autowired
    private AppConfigProperties properties;

    @Test
    void testProdProfileLoaded() {
        assertEquals("production", properties.getEnvironment());
        assertEquals("Hello from PROD Environment!", properties.getGreeting());
        assertFalse(properties.isFeatureFlagEnabled());
        assertEquals(0.10, properties.getTaxRate());
        assertEquals(5, properties.getMaxRetries());
        assertEquals(60, properties.getTimeout().toSeconds());
        assertEquals(50, properties.getMaxFileSize().toMegabytes());
        assertEquals("production-live", properties.getMetadata().get("tier"));
    }
}
