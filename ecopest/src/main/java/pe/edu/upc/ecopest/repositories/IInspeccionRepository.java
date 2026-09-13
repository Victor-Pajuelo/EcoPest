package pe.edu.upc.ecopest.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pe.edu.upc.ecopest.entities.Inspeccion;

import java.util.List;

@Repository
public interface IInspeccionRepository extends JpaRepository<Inspeccion, Long> {
    List<Inspeccion> findByEstadoInspeccion(String estado);

    @Query(value = "SELECT e.nombre_empresa, COUNT(i.id_inspeccion) " +
            "FROM entidades e LEFT JOIN inspecciones i ON e.id_entidad = i.id_entidad " +
            "GROUP BY e.nombre_empresa", nativeQuery = true)
    List<Object[]> countInspeccionesPorEmpresa();
}
