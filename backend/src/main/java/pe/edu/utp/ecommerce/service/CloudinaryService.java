package pe.edu.utp.ecommerce.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        String cName = cloudinary.config.cloudName != null ? cloudinary.config.cloudName.trim() : "";
        if (cName.equals("your_cloud_name_here") || cName.isEmpty() || cName.contains("placeholder") || cName.equals("mezclagqszp")) {
            return encodeToBase64(file);
        }

        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return uploadResult.get("url").toString();
        } catch (Exception e) {
            System.err.println("[Servitek Cloudinary Warn]: No se pudo subir a la nube (" + e.getMessage() + "). Realizando fallback automático a almacenamiento seguro Base64.");
            return encodeToBase64(file);
        }
    }

    private String encodeToBase64(MultipartFile file) throws IOException {
        String base64Image = java.util.Base64.getEncoder().encodeToString(file.getBytes());
        String contentType = file.getContentType() != null ? file.getContentType() : "image/jpeg";
        return "data:" + contentType + ";base64," + base64Image;
    }
}
