package pe.edu.upc.ecopest.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pe.edu.upc.ecopest.entities.Incidencia;

import java.util.List;

@Repository
public interface IIncidenciaRepository extends JpaRepository<Incidencia, Long> {
    List<Incidencia> findByInspeccion_Entidad_IdEntidad(Long idEntidad);

    @Query(value = "SELECT tp.name_tipo_plaga, COUNT(inc.id_incidencia) " +
            "FROM tipos_plaga tp LEFT JOIN incidencias inc ON tp.id_tipo_plaga = inc.id_tipo_plaga " +
            "GROUP BY tp.name_tipo_plaga", nativeQuery = true)
    List<Object[]> countIncidenciasPorTipoPlaga();
}
