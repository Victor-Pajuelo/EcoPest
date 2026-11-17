package pe.edu.upc.ecopest.clients;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClient;
import pe.edu.upc.ecopest.exceptions.ExternalServiceException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class GeminiClient {

    private final RestClient restClient;
    private final String apiKey;
    private final String model;
    private final String fallbackModel;
    private final AiUsageLimiter limiter;

    // Maximos para que una sola peticion no gaste demasiado: texto de 4000 caracteres e imagen de unos 2 MB
    private static final int MAX_PROMPT_CHARS = 4000;
    private static final int MAX_IMAGE_BASE64_CHARS = 3_000_000;

    public GeminiClient(AiUsageLimiter limiter,
                        @Value("${gemini.api-key:}") String apiKey,
                        @Value("${gemini.model:gemini-3.8-flash}") String model,
                        @Value("${gemini.fallback-model:gemini-3.1-flash-lite}") String fallbackModel,
                        @Value("${gemini.base-url:https://generativelanguage.googleapis.com}") String baseUrl) {
        this.apiKey = apiKey;
        this.model = model;
        this.fallbackModel = fallbackModel;
        this.limiter = limiter;
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    public String generate(String systemInstruction, String prompt) {
        return generate(systemInstruction, prompt, null, null);
    }

    private Map<String, Object> callModel(String modelName, Map<String, Object> request) {
        return restClient.post()
                .uri("/v1beta/models/{model}:generateContent", modelName)
                .header("x-goog-api-key", apiKey)
                .body(request)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});
    }

    @SuppressWarnings("unchecked")
    public String generate(String systemInstruction, String prompt, String mimeType, String imageBase64) {
        if (!isConfigured()) {
            throw new ExternalServiceException("AI is not configured: set the GEMINI_API_KEY environment variable");
        }
        if (prompt != null && prompt.length() > MAX_PROMPT_CHARS) {
            throw new IllegalArgumentException("The text is too long (maximum " + MAX_PROMPT_CHARS + " characters)");
        }
        if (imageBase64 != null && imageBase64.length() > MAX_IMAGE_BASE64_CHARS) {
            throw new IllegalArgumentException("The image is too large (maximum 2 MB)");
        }
        limiter.acquire();
        List<Map<String, Object>> requestParts = new ArrayList<>();
        requestParts.add(Map.of("text", prompt));
        if (imageBase64 != null && !imageBase64.isBlank()) {
            requestParts.add(Map.of("inlineData", Map.of("mimeType", mimeType, "data", imageBase64)));
        }
        Map<String, Object> request = Map.of(
                "systemInstruction", Map.of("parts", List.of(Map.of("text", systemInstruction))),
                "contents", List.of(Map.of("role", "user", "parts", requestParts)),
                "generationConfig", Map.of("maxOutputTokens", 512));
        try {
            Map<String, Object> body;
            try {
                body = callModel(model, request);
            } catch (HttpServerErrorException | HttpClientErrorException.TooManyRequests e) {
                // Si el modelo principal esta saturado (503) o sin cuota (429), se prueba el modelo de respaldo
                if (fallbackModel == null || fallbackModel.isBlank() || fallbackModel.equals(model)) {
                    throw e;
                }
                body = callModel(fallbackModel, request);
            }
            List<Map<String, Object>> candidates = body == null ? null : (List<Map<String, Object>>) body.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                throw new ExternalServiceException("The AI service returned no answer");
            }
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = content == null ? null : (List<Map<String, Object>>) content.get("parts");
            if (parts == null || parts.isEmpty() || parts.get(0).get("text") == null) {
                throw new ExternalServiceException("The AI service returned an empty answer");
            }
            return String.valueOf(parts.get(0).get("text")).trim();
        } catch (ExternalServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new ExternalServiceException("Could not get a recommendation from the AI service", e);
        }
    }
}
