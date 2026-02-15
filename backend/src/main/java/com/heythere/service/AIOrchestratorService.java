package com.heythere.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AIOrchestratorService {

    @Autowired
    private GemmaAIService gemmaAIService;

    @Autowired
    private AmazonNovaService amazonNovaService;

    @Autowired
    private MistralService mistralService;

    @Autowired
    private NemotronService nemotronService;

    @Autowired
    private OpenRouterTextService openRouterTextService;

    @Autowired
    private LocalGemmaService localGemmaService;

    /**
     * Dispatch AI calls based on the selected model.
     * Supports image-capable models (Gemma, Nova, Mistral, Nemotron) and text‑only models (GPT‑OSS, Llama).
     */
    public String callAI(String model, String message, MultipartFile image) {
        if (model == null || model.isEmpty()) {
            model = "gemma"; // default
        }
        return switch (model.toLowerCase()) {
            case "gemma" -> gemmaAIService.call(message, image);
            case "nova" -> amazonNovaService.call(message, image);
            case "mistral" -> mistralService.call(message, image);
            case "nemotron" -> nemotronService.call(message, image);
            case "gpt-oss" -> openRouterTextService.call(message, "google/gemma-2-27b-it");
            case "llama" -> openRouterTextService.call(message, "meta-llama/llama-3.3-70b-instruct");
            case "gemma-local" -> localGemmaService.call(message, image);
            default -> throw new IllegalArgumentException("Unsupported model: " + model);
        };
    }
}
