package pe.edu.upc.ecopest.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.edu.upc.ecopest.entities.TipoPlaga;

import java.util.List;

@Repository
public interface ITipoPlagaRepository extends JpaRepository<TipoPlaga, Long> {
    List<TipoPlaga> findByNivelRiesgoTipoPlaga(String nivelRiesgo);
}
