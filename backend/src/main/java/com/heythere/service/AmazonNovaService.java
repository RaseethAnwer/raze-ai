package com.heythere.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
public class AmazonNovaService {

    @Value("${amazon.nova.api.key}")
    private String apiKey;

    private static final String OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

    public String call(String message, MultipartFile image) {
        // For simplicity, image handling is omitted; can be extended to send base64 if needed.
        return callOpenRouter("amazon/nova-micro-v1", message);
    }

    private String callOpenRouter(String model, String message) {
        RestTemplate rest = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("HTTP-Referer", "http://localhost:3000");
        headers.set("X-Title", "Raze AI");

        Map<String, Object> body = new HashMap<>();
        body.put("model", model);
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "user", "content", message));
        body.put("messages", messages);

        try {
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = rest.exchange(OPENROUTER_URL, HttpMethod.POST, request, Map.class);
            if (response.getBody() != null) {
                List<Map> choices = (List<Map>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map msgObj = (Map) choices.get(0).get("message");
                    return msgObj.get("content").toString();
                }
            }
            return "Error: Invalid response from OpenRouter";
        } catch (Exception e) {
            return "Amazon Nova Error: " + e.getMessage();
        }
    }
}
