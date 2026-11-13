package pe.edu.upc.ecopest.clients;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
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

    public GeminiClient(@Value("${gemini.api-key:}") String apiKey,
                        @Value("${gemini.model:gemini-3.8-flash}") String model,
                        @Value("${gemini.base-url:https://generativelanguage.googleapis.com}") String baseUrl) {
        this.apiKey = apiKey;
        this.model = model;
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    public String generate(String systemInstruction, String prompt) {
        return generate(systemInstruction, prompt, null, null);
    }

    @SuppressWarnings("unchecked")
    public String generate(String systemInstruction, String prompt, String mimeType, String imageBase64) {
        if (!isConfigured()) {
            throw new ExternalServiceException("AI is not configured: set the GEMINI_API_KEY environment variable");
        }
        List<Map<String, Object>> requestParts = new ArrayList<>();
        requestParts.add(Map.of("text", prompt));
        if (imageBase64 != null && !imageBase64.isBlank()) {
            requestParts.add(Map.of("inlineData", Map.of("mimeType", mimeType, "data", imageBase64)));
        }
        Map<String, Object> request = Map.of(
                "systemInstruction", Map.of("parts", List.of(Map.of("text", systemInstruction))),
                "contents", List.of(Map.of("role", "user", "parts", requestParts)),
                "generationConfig", Map.of("maxOutputTokens", 1024));
        try {
            Map<String, Object> body = restClient.post()
                    .uri("/v1beta/models/{model}:generateContent", model)
                    .header("x-goog-api-key", apiKey)
                    .body(request)
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {});
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
