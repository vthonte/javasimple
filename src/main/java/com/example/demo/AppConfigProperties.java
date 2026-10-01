package com.example.demo;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Configuration
@ConfigurationProperties(prefix = "app")
public class AppConfigProperties {

    // 1. String
    private String environment;
    private String appName;
    private String greeting;

    // 2. Integer
    private int serverPort;
    private int maxRetries;

    // 3. Long
    private long rateLimit;

    // 4. Boolean
    private boolean featureFlagEnabled;

    // 5. Double
    private double taxRate;

    // 6. List / Array
    private List<String> allowedOrigins;

    // 7. Map / Key-Value
    private Map<String, String> metadata;

    // 8. Duration (java.time.Duration)
    private Duration timeout;

    // 9. DataSize (org.springframework.util.unit.DataSize)
    private DataSize maxFileSize;

    // 10. Sensitive Secret (String)
    private String secretApiKey;

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getGreeting() {
        return greeting;
    }

    public void setGreeting(String greeting) {
        this.greeting = greeting;
    }

    public int getServerPort() {
        return serverPort;
    }

    public void setServerPort(int serverPort) {
        this.serverPort = serverPort;
    }

    public int getMaxRetries() {
        return maxRetries;
    }

    public void setMaxRetries(int maxRetries) {
        this.maxRetries = maxRetries;
    }

    public long getRateLimit() {
        return rateLimit;
    }

    public void setRateLimit(long rateLimit) {
        this.rateLimit = rateLimit;
    }

    public boolean isFeatureFlagEnabled() {
        return featureFlagEnabled;
    }

    public void setFeatureFlagEnabled(boolean featureFlagEnabled) {
        this.featureFlagEnabled = featureFlagEnabled;
    }

    public double getTaxRate() {
        return taxRate;
    }

    public void setTaxRate(double taxRate) {
        this.taxRate = taxRate;
    }

    public List<String> getAllowedOrigins() {
        return allowedOrigins;
    }

    public void setAllowedOrigins(List<String> allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }

    public Map<String, String> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public Duration getTimeout() {
        return timeout;
    }

    public void setTimeout(Duration timeout) {
        this.timeout = timeout;
    }

    public DataSize getMaxFileSize() {
        return maxFileSize;
    }

    public void setMaxFileSize(DataSize maxFileSize) {
        this.maxFileSize = maxFileSize;
    }

    public String getSecretApiKey() {
        return secretApiKey;
    }

    public void setSecretApiKey(String secretApiKey) {
        this.secretApiKey = secretApiKey;
    }
}
