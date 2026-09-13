package pe.edu.upc.ecopest.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pe.edu.upc.ecopest.entities.Entidad;

import java.util.List;

@Repository
public interface IEntidadRepository extends JpaRepository<Entidad, Long> {
    List<Entidad> findByTypeEntidad(String tipo);

    @Query(value = "SELECT e.nombre_empresa, COUNT(u.id_usuario) " +
            "FROM entidades e LEFT JOIN usuarios u ON e.id_entidad = u.id_entidad " +
            "GROUP BY e.nombre_empresa", nativeQuery = true)
    List<Object[]> countUsuariosPorEmpresa();
}
