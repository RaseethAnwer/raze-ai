package com.heythere.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    // ============================================
    //  GEMINI CONFIGURATION (Currently Commented)
    // ============================================

    /*
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public String callGemini(String message) {
        try {
            Client client = Client.builder()
                    .apiKey(geminiApiKey)
                    .build();

            GenerateContentResponse response = client.models.generateContent(
                    "gemini-2.0-flash",
                    message,
                    null
            );

            return response.text();

        } catch (Exception e) {
            return "Gemini Error: " + e.getMessage();
        }
    }

    public String callGeminiWithImage(String message, String imagePath) {
        return callGemini(message + " (Image support not implemented yet)");
    }
    */

    // ============================================
    //  GROK (OPENROUTER) CONFIGURATION
    // ============================================

    @Value("${openrouter.api.key}")
    private String openrouterApiKey;

    private static final String OPENROUTER_URL =
            "https://openrouter.ai/api/v1/chat/completions";

    public String callGrok(String message) {
        try {

            RestTemplate rest = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            headers.set("Authorization", "Bearer " + openrouterApiKey);
            headers.set("HTTP-Referer", "http://localhost:3000");
            headers.set("X-Title", "Hey There AI");

            Map<String, Object> body = new HashMap<>();
            body.put("model", "google/gemma-3-4b-it:free");

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "user", "content", message));
            body.put("messages", messages);

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(body, headers);

            ResponseEntity<Map> response =
                    rest.exchange(OPENROUTER_URL, HttpMethod.POST, request, Map.class);

            assert response.getBody() != null;
            Map<?, ?> choice = ((List<Map<?, ?>>)
                    response.getBody().get("choices")).get(0);

            Map<?, ?> msgObj = (Map<?, ?>) choice.get("message");

            return msgObj.get("content").toString();

        } catch (Exception e) {
            return "Grok Error: " + e.getMessage();
        }
    }
    public String callGeminiWithImage(String message, String imagePath) {
        return callGrok(message + " (Image support not implemented yet)");
    }

}
