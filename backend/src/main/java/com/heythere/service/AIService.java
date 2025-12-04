package com.heythere.service;

import com.google.genai.Client;
import com.google.genai.types.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class AIService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${openrouter.api.key}")
    private String openrouterApiKey;

    private static final String OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

    /**
     * Unified AI call method that routes to the appropriate AI provider
     * @param model The AI model to use (gemini-2.0-flash, gemini-vision, google/gemma-3-4b-it:free, grok-2-latest)
     * @param message The user's message
     * @param image Optional image file (required for gemini-vision)
     * @return AI response text
     */
    public String callAI(String model, String message, MultipartFile image) throws IOException {
        if (model == null || model.isEmpty()) {
            model = "gemini-2.0-flash"; // Default model
        }

        // Route to appropriate AI provider
        if (model.startsWith("gemini")) {
            return callGemini(model, message, image);
        } else {
            return callOpenRouter(model, message);
        }
    }

    /**
     * Call Gemini models using the Google GenAI SDK
     */
    private String callGemini(String model, String message, MultipartFile image) throws IOException {
        try {
            Client client = Client.builder()
                    .apiKey(geminiApiKey)
                    .build();

            String modelName = model.equals("gemini-vision") ? "gemini-2.0-flash-exp" : "gemini-2.0-flash-exp";

            // If image is provided and model is gemini-vision, use multimodal
            if (image != null && !image.isEmpty() && model.equals("gemini-vision")) {
                return callGeminiWithImage(client, modelName, message, image);
            } else {
                // Text-only call
                GenerateContentResponse response = client.models.generateContent(
                        modelName,
                        message,
                        null
                );
                return response.text();
            }

        } catch (Exception e) {
            return "Gemini Error: " + e.getMessage();
        }
    }

    /**
     * Call Gemini with image (multimodal)
     */
    private String callGeminiWithImage(Client client, String modelName, String message, MultipartFile image) throws IOException {
        try {
            // Read image bytes
            byte[] imageBytes = image.getBytes();
            String mimeType = image.getContentType();
            if (mimeType == null) {
                mimeType = "image/jpeg"; // Default
            }

            // Create inline data for the image
            Blob imageBlob = new Blob(mimeType, imageBytes);
            Part imagePart = new Part(imageBlob);
            Part textPart = new Part(message);

            // Create content with both text and image
            Content content = new Content(Arrays.asList(textPart, imagePart));

            // Generate response
            GenerateContentResponse response = client.models.generateContent(
                    modelName,
                    content,
                    null
            );

            return response.text();

        } catch (Exception e) {
            return "Gemini Vision Error: " + e.getMessage();
        }
    }

    /**
     * Call OpenRouter API for Gemma 3 and Grok 2 models
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
