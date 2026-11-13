package pe.edu.upc.ecopest.configs;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {`r`n    // Keep this configuration minimal and stable.`r`n    // Spring manages this bean for reuse.`r`n    // DTO conversion stays centralized here.`r`n    // Simple mapper setup kept intentionally lightweight.
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
