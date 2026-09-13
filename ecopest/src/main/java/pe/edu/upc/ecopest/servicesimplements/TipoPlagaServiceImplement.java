package pe.edu.upc.ecopest.servicesimplements;

import org.springframework.stereotype.Service;
import pe.edu.upc.ecopest.entities.TipoPlaga;
import pe.edu.upc.ecopest.repositories.ITipoPlagaRepository;
import pe.edu.upc.ecopest.servicesinterfaces.ITipoPlagaService;

import java.util.List;
import java.util.Optional;

@Service
public class TipoPlagaServiceImplement implements ITipoPlagaService {
    private final ITipoPlagaRepository tR;

    public TipoPlagaServiceImplement(ITipoPlagaRepository tR) { this.tR = tR; }

    @Override public void insert(TipoPlaga tp) { tR.save(tp); }
    @Override public List<TipoPlaga> list() { return tR.findAll(); }
    @Override public List<TipoPlaga> listByNivelRiesgo(String nivelRiesgo) { return tR.findByNivelRiesgoTipoPlaga(nivelRiesgo); }
    @Override public Optional<TipoPlaga> listId(Long id) { return tR.findById(id); }
}
