package pe.edu.utp.ecommerce.Config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud-name:mezclagqszp}")
    private String cloudName;

    @Value("${cloudinary.api-key:821249167372321}")
    private String apiKey;

    @Value("${cloudinary.api-secret:Kb8Sw3IoLoT6SbtKRRHS8JGhh6c}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", cloudName != null ? cloudName.trim() : "");
        config.put("api_key", apiKey != null ? apiKey.trim() : "");
        config.put("api_secret", apiSecret != null ? apiSecret.trim() : "");
        return new Cloudinary(config);
    }
}
