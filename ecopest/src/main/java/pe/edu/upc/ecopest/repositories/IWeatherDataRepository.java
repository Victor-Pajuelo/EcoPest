package pe.edu.upc.ecopest.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pe.edu.upc.ecopest.entities.WeatherData;
import java.util.List;

@Repository
public interface IWeatherDataRepository extends JpaRepository<WeatherData, Long> {

    // Método original
    List<WeatherData> findByBusinessEntity_IdBusinessEntity(Long businessEntityId);

    // Borrado por ID de BusinessEntity
    void deleteByBusinessEntity_IdBusinessEntity(Long businessEntityId);

    // Consulta corregida navegando a través de BusinessEntity
    @Query("SELECT DISTINCT w FROM WeatherData w " +
            "JOIN w.businessEntity be " +
            "WHERE be.idBusinessEntity IN (" +
            "    SELECT i.inspection.businessEntity.idBusinessEntity FROM Incident i " +
            "    WHERE i.pestType.name = :pestName" +
            ")")
    List<WeatherData> findWeatherByPestType(@Param("pestName") String pestName);
}