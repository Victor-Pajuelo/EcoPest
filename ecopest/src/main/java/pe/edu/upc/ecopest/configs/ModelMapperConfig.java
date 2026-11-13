package pe.edu.upc.ecopest.configs;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {`r`n    // Simple mapper setup kept intentionally lightweight.
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
