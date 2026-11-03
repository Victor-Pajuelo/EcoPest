package pe.edu.upc.ecopest.exceptions;

/**
 * Se lanza cuando falla (o no esta configurada) una API externa de terceros,
 * por ejemplo Open-Meteo o Gemini.
 */
public class ExternalServiceException extends RuntimeException {
    public ExternalServiceException(String message) {
        super(message);
    }

    public ExternalServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
