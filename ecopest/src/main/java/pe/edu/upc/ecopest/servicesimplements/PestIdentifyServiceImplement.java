package pe.edu.upc.ecopest.servicesimplements;

import org.springframework.stereotype.Service;
import pe.edu.upc.ecopest.clients.GeminiClient;
import pe.edu.upc.ecopest.dtos.PestIdentifyRequestDTO;
import pe.edu.upc.ecopest.entities.PestType;
import pe.edu.upc.ecopest.servicesinterfaces.IPestIdentifyService;
import pe.edu.upc.ecopest.servicesinterfaces.IPestTypeService;

import java.util.List;

@Service
public class PestIdentifyServiceImplement implements IPestIdentifyService {
    private final GeminiClient geminiClient;
    private final IPestTypeService pestTypeService;

    public PestIdentifyServiceImplement(GeminiClient geminiClient, IPestTypeService pestTypeService) {
        this.geminiClient = geminiClient;
        this.pestTypeService = pestTypeService;
    }

    @Override
    public String identify(PestIdentifyRequestDTO request) {
        boolean hasText = request.getText() != null && !request.getText().isBlank();
        boolean hasImage = request.getImageBase64() != null && !request.getImageBase64().isBlank();
        if (!hasText && !hasImage) {
            throw new IllegalArgumentException("Send a text description or an image of the pest");
        }

        // Plagas que ya estan registradas en el sistema, para que la IA las use como referencia
        List<PestType> pests = pestTypeService.list();
        StringBuilder known = new StringBuilder();
        for (PestType pest : pests) {
            known.append(pest.getName()).append(", ");
        }

        String system = "Eres un experto en control integrado de plagas. Responde en espanol, "
                + "maximo 600 caracteres: indica el nombre de la plaga mas probable, su nivel de riesgo "
                + "(bajo, medio, alto o critico) y una accion recomendada. Si no estas seguro, dilo.";
        String prompt = hasText ? request.getText() : "Identifica la plaga que aparece en la imagen.";
        if (known.length() > 0) {
            prompt = prompt + "\nPlagas registradas en el sistema: " + known;
        }

        String mimeType = request.getMimeType() == null ? "image/jpeg" : request.getMimeType();
        return geminiClient.generate(system, prompt, mimeType, hasImage ? request.getImageBase64() : null);
    }
}
