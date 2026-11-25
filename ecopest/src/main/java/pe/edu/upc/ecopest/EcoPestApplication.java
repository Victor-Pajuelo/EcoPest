package pe.edu.upc.ecopest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class EcoPestApplication {
    public static void main(String[] args) {
        // Render corre en UTC: se fija la hora de Peru para que las fechas del clima,
        // evidencias y recomendaciones no salgan adelantadas (UTC esta 5 horas adelante)
        TimeZone.setDefault(TimeZone.getTimeZone("America/Lima"));
        SpringApplication.run(EcoPestApplication.class, args);
    }
}
