package com.heythere.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.heythere.service.AIOrchestratorService;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class AIService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemma.api.key}")
    private String openrouterApiKey;

    @Autowired
    private AIOrchestratorService aiOrchestratorService;

    private static final String OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

    /**
     * Unified AI call method that routes to the appropriate AI provider
     */
    public String callAI(String model, String message, MultipartFile image) throws IOException {
        // Delegate to orchestrator which handles model routing
        return aiOrchestratorService.callAI(model, message, image);
    }

    /**
     * Call Gemini using the working pattern from GeminiService
     */
    private String callGemini(String message) {
        try {
            Client client = Client.builder()
                    .apiKey(geminiApiKey)
                    .build();

            GenerateContentResponse response = client.models.generateContent(
                    "gemini-2.0-flash-exp",
                    message,
                    null
            );

            return response.text();

        } catch (Exception e) {
            return "Gemini Error: " + e.getMessage();
        }
    }

    /**
     * Call OpenRouter for Gemma 3 and Grok 2
     */
    private String callOpenRouter(String model, String message) {
        try {
            RestTemplate rest = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + openrouterApiKey);
            headers.set("HTTP-Referer", "http://localhost:3000");
            headers.set("X-Title", "Raze AI");

            Map<String, Object> body = new HashMap<>();
            body.put("model", model);

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "user", "content", message));
            body.put("messages", messages);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = rest.exchange(OPENROUTER_URL, HttpMethod.POST, request, Map.class);

            assert response.getBody() != null;
            Map<?, ?> choice = ((List<Map<?, ?>>) response.getBody().get("choices")).get(0);
            Map<?, ?> msgObj = (Map<?, ?>) choice.get("message");

            return msgObj.get("content").toString();

        } catch (Exception e) {
            return "OpenRouter Error: " + e.getMessage();
        }
    }
}
