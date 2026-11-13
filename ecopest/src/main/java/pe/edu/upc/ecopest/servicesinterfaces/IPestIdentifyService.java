package pe.edu.upc.ecopest.servicesinterfaces;

import pe.edu.upc.ecopest.dtos.PestIdentifyRequestDTO;

public interface IPestIdentifyService {
    String identify(PestIdentifyRequestDTO request);
}
