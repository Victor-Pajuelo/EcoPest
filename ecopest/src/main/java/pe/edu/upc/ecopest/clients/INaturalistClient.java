package pe.edu.upc.ecopest.clients;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import pe.edu.upc.ecopest.exceptions.ExternalServiceException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class INaturalistClient {

    public record Taxon(long id, String scientificName, String commonName, String rank, String photoUrl, String wikipediaUrl) {}

    private final RestClient restClient;

    public INaturalistClient() {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.inaturalist.org")
                .defaultHeader("User-Agent", "EcoPest-UPC/1.0")
                .build();
    }

    @SuppressWarnings("unchecked")
    public List<Taxon> search(String query) {
        try {
            Map<String, Object> body = restClient.get()
                    .uri(uri -> uri.path("/v1/taxa")
                            .queryParam("q", query)
                            .queryParam("locale", "es")
                            .queryParam("per_page", 8)
                            .queryParam("is_active", true)
                            .build())
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {});
            List<Map<String, Object>> results = (List<Map<String, Object>>) body.get("results");
            List<Taxon> taxa = new ArrayList<>();
            for (Map<String, Object> item : results) {
                Map<String, Object> photo = (Map<String, Object>) item.get("default_photo");
                taxa.add(new Taxon(
                        ((Number) item.get("id")).longValue(),
                        (String) item.get("name"),
                        (String) item.get("preferred_common_name"),
                        (String) item.get("rank"),
                        photo == null ? null : (String) photo.get("medium_url"),
                        (String) item.get("wikipedia_url")));
            }
            return taxa;
        } catch (Exception e) {
            throw new ExternalServiceException("No se pudo consultar iNaturalist", e);
        }
    }
}
