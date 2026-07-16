package pe.edu.utp.ecommerce.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.ecommerce.DTO.AuthResponse;
import pe.edu.utp.ecommerce.DTO.ForgotPasswordRequest;
import pe.edu.utp.ecommerce.DTO.LoginRequest;
import pe.edu.utp.ecommerce.DTO.RegisterRequest;
import pe.edu.utp.ecommerce.DTO.ResetPasswordRequest;
import pe.edu.utp.ecommerce.model.Usuario;
import pe.edu.utp.ecommerce.repository.UsuarioRepository;
import pe.edu.utp.ecommerce.security.CustomUserDetailsService;
import pe.edu.utp.ecommerce.security.JwtUtil;
import pe.edu.utp.ecommerce.service.EmailService;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private org.springframework.mail.javamail.JavaMailSender mailSender;

    @GetMapping("/test-email")
    public ResponseEntity<?> testEmail(@RequestParam(defaultValue = "yrcervando01@gmail.com") String to) {
        java.util.Map<String, Object> resp = new java.util.HashMap<>();
        if (mailSender == null) {
            resp.put("error", "JavaMailSender es NULL. Verifica servitek.mail.enabled o la configuración de Spring.");
            return ResponseEntity.badRequest().body(resp);
        }
        try {
            org.springframework.mail.SimpleMailMessage msg = new org.springframework.mail.SimpleMailMessage();
            msg.setFrom("Servitek Peru <yrcervando01@gmail.com>");
            msg.setTo(to);
            msg.setSubject("Prueba de Correo Servitek Railway");
            msg.setText("Hola desde Railway. Si recibes esto, la configuración SMTP funciona perfectamente.");
            mailSender.send(msg);
            resp.put("exito", true);
            resp.put("mensaje", "Correo enviado exitosamente a " + to);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            resp.put("exito", false);
            resp.put("errorTipo", e.getClass().getName());
            resp.put("errorMessage", e.getMessage());
            java.io.StringWriter sw = new java.io.StringWriter();
            e.printStackTrace(new java.io.PrintWriter(sw));
            resp.put("stacktrace", sw.toString());
            return ResponseEntity.badRequest().body(resp);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);
        
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail()).orElseThrow();
        
        return ResponseEntity.ok(new AuthResponse(jwt, AuthResponse.UsuarioDTO.fromUsuario(usuario)));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("El email ya esta en uso");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setTelefono(request.getTelefono());
        usuario.setRol(Usuario.Rol.CLIENTE);

        usuarioRepository.save(usuario);

        // Enviar correo de bienvenida transaccional estilo Apple/Nielsen UX
        try {
            emailService.enviarCorreoBienvenida(usuario);
        } catch (Exception ignored) {}

        return ResponseEntity.ok("Usuario registrado exitosamente");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("Debes ingresar un correo electrónico válido.");
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(request.getEmail().trim());
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // Generar código numérico de 6 dígitos
            String codigo = String.format("%06d", new Random().nextInt(999999));
            usuario.setCodigoRecuperacion(codigo);
            usuario.setExpiracionCodigo(LocalDateTime.now().plusMinutes(15));
            usuarioRepository.save(usuario);

            try {
                emailService.enviarCorreoCodigoRecuperacion(usuario, codigo);
            } catch (Exception ignored) {}
        }

        // Devolvemos mensaje genérico para evitar enumeración de correos por motivos de privacidad
        return ResponseEntity.ok("Si el correo está registrado en Servitek, recibirás un código de seguridad de 6 dígitos en unos momentos.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        if (request.getEmail() == null || request.getCodigo() == null || request.getNuevaPassword() == null) {
            return ResponseEntity.badRequest().body("Todos los campos son obligatorios.");
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(request.getEmail().trim());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Código de verificación o correo inválido.");
        }

        Usuario usuario = usuarioOpt.get();
        if (usuario.getCodigoRecuperacion() == null || !usuario.getCodigoRecuperacion().equals(request.getCodigo().trim())) {
            return ResponseEntity.badRequest().body("El código de verificación es incorrecto.");
        }

        if (usuario.getExpiracionCodigo() != null && LocalDateTime.now().isAfter(usuario.getExpiracionCodigo())) {
            return ResponseEntity.badRequest().body("El código de verificación ha expirado. Solicita uno nuevo.");
        }

        usuario.setPasswordHash(passwordEncoder.encode(request.getNuevaPassword()));
        usuario.setCodigoRecuperacion(null);
        usuario.setExpiracionCodigo(null);
        usuarioRepository.save(usuario);

        try {
            emailService.enviarCorreoConfirmacionCambioPassword(usuario);
        } catch (Exception ignored) {}

        return ResponseEntity.ok("Contraseña actualizada correctamente. Ya puedes iniciar sesión con tu nueva clave.");
    }
}
