package pe.edu.upc.ecopest.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.edu.upc.ecopest.entities.WeatherData;
import java.util.List;

@Repository
public interface IWeatherDataRepository extends JpaRepository<WeatherData, Long> {
    List<WeatherData> findByBusinessEntity_IdBusinessEntity(Long businessEntityId);
}
