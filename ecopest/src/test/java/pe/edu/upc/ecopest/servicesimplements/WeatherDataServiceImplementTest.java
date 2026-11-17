package pe.edu.upc.ecopest.servicesimplements;

import org.junit.jupiter.api.Test;
import pe.edu.upc.ecopest.clients.OpenMeteoClient.DailyForecast;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

class WeatherDataServiceImplementTest {
    // pestRisk solo calcula con los datos del dia, por eso no necesita repositorio ni cliente
    private final WeatherDataServiceImplement service = new WeatherDataServiceImplement(null, null, null);

    @Test
    void humedadAltaTemperaturaCalidaYLluviaDanRiesgoAlto() {
        DailyForecast day = new DailyForecast(LocalDate.now(), 30, 22, 3, 85);
        assertEquals("ALTO", service.pestRisk(day));
    }

    @Test
    void humedadYTemperaturaFavorablesDanRiesgoMedio() {
        DailyForecast day = new DailyForecast(LocalDate.now(), 28, 22, 0, 72);
        assertEquals("MEDIO", service.pestRisk(day));
    }

    @Test
    void climaFrioYSecoDaRiesgoBajo() {
        DailyForecast day = new DailyForecast(LocalDate.now(), 15, 9, 0, 50);
        assertEquals("BAJO", service.pestRisk(day));
    }
}
