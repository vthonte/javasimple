package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class HelloController {

    private final AppConfigProperties properties;

    // Also showing direct @Value injection for comparison
    @Value("${app.greeting}")
    private String greetingFromValue;

    public HelloController(AppConfigProperties properties) {
        this.properties = properties;
    }

    @GetMapping("/hello")
    public String hello() {
        return properties.getGreeting();
    }

    @GetMapping("/config")
    public Map<String, Object> getConfig() {
        Map<String, Object> config = new LinkedHashMap<>();

        // 1. String
        config.put("environment", properties.getEnvironment());
        config.put("appName", properties.getAppName());
        config.put("greeting", properties.getGreeting());
        config.put("greetingFromValueAnnotation", greetingFromValue);

        // 2. Integer
        config.put("serverPort", properties.getServerPort());
        config.put("maxRetries", properties.getMaxRetries());

        // 3. Long
        config.put("rateLimit", properties.getRateLimit());

        // 4. Boolean
        config.put("featureFlagEnabled", properties.isFeatureFlagEnabled());

        // 5. Double
        config.put("taxRate", properties.getTaxRate());

        // 6. List / Array
        config.put("allowedOrigins", properties.getAllowedOrigins());

        // 7. Map / Key-Value
        config.put("metadata", properties.getMetadata());

        // 8. Duration
        if (properties.getTimeout() != null) {
            config.put("timeoutSeconds", properties.getTimeout().toSeconds());
            config.put("timeoutFormatted", properties.getTimeout().toString());
        }

        // 9. DataSize
        if (properties.getMaxFileSize() != null) {
            config.put("maxFileSizeBytes", properties.getMaxFileSize().toBytes());
            config.put("maxFileSizeMegabytes", properties.getMaxFileSize().toMegabytes());
        }

        // 10. Masked Secret Key
        String secret = properties.getSecretApiKey();
        String maskedSecret = (secret != null && secret.length() > 6)
                ? secret.substring(0, 3) + "****" + secret.substring(secret.length() - 3)
                : "****";
        config.put("secretApiKeyMasked", maskedSecret);

        return config;
    }
}
