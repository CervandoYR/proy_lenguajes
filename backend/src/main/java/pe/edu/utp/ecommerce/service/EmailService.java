package pe.edu.utp.ecommerce.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import pe.edu.utp.ecommerce.model.DetallePedido;
import pe.edu.utp.ecommerce.model.Pedido;
import pe.edu.utp.ecommerce.model.Usuario;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;

@Service
@Slf4j
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${servitek.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${servitek.mail.from:Servitek Perú <notificaciones@servitek.pe>}")
    private String mailFrom;

    /**
     * Envío asíncrono para no bloquear los flujos transaccionales de usuario o pedido.
     */
    @Async
    public void enviarCorreo(String destinatario, String asunto, String contenidoHtml) {
        if (!mailEnabled || mailSender == null) {
            log.info("========================================================================================");
            log.info("[SIMULACIÓN CORREO - APPLE/NIELSEN UX] (Para activar SMTP real configura servitek.mail.enabled=true)");
            log.info("De: {}", mailFrom);
            log.info("Para: {}", destinatario);
            log.info("Asunto: {}", asunto);
            log.info("Contenido HTML:\n{}", contenidoHtml);
            log.info("========================================================================================");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
            
            if (mailFrom != null && mailFrom.contains("<") && mailFrom.contains(">")) {
                int start = mailFrom.indexOf('<');
                int end = mailFrom.indexOf('>');
                String email = mailFrom.substring(start + 1, end).trim();
                String name = mailFrom.substring(0, start).trim();
                if (name.isEmpty()) name = "Servitek Perú";
                helper.setFrom(email, name);
            } else {
                helper.setFrom(mailFrom, "Servitek Perú");
            }

            helper.setTo(destinatario);
            helper.setSubject(asunto);
            helper.setText(contenidoHtml, true);

            mailSender.send(message);
            log.info("Correo electrónico enviado exitosamente a: {} | Asunto: {}", destinatario, asunto);
        } catch (Exception e) {
            log.error("Error al enviar correo electrónico vía SMTP a {}: {}", destinatario, e.getMessage(), e);
            log.error("CONSEJO DIAGNÓSTICO SMTP: Si es error 535 (auth), verifica tu Contraseña de Aplicación de Gmail. Si es Timeout, verifica que Railway permita salida por puerto 587 o prueba con puerto 465.");
        }
    }

    /**
     * 1. Correo de bienvenida (Registro de nuevo usuario)
     */
    @Async
    public void enviarCorreoBienvenida(Usuario usuario) {
        String asunto = "Bienvenido a Servitek Perú";
        String cuerpo = String.format(
            "<p class='lead'>Hola %s,</p>" +
            "<p>Nos alegra darte la bienvenida a <strong>Servitek Perú</strong>. Tu cuenta ha sido creada y verificada correctamente.</p>" +
            "<p>A partir de ahora puedes explorar nuestro catálogo, guardar tus configuraciones y realizar compras con garantía por escrito en todo el país.</p>" +
            "<div class='info-box'>" +
            "  <div class='label'>Tu cuenta registrada</div>" +
            "  <div class='value'>%s</div>" +
            "</div>" +
            "<p style='margin-top: 24px;'>Si necesitas asesoría para elegir tu equipo o componente, nuestro equipo de soporte técnico está disponible para ayudarte de forma directa.</p>" +
            "<div style='margin-top: 32px; text-align: center;'>" +
            "  <a href='http://localhost:5173/login' class='btn'>Iniciar sesión</a>" +
            "</div>",
            usuario.getNombre(), usuario.getEmail()
        );
        enviarCorreo(usuario.getEmail(), asunto, envolverPlantilla("Bienvenido a Servitek", cuerpo));
    }

    /**
     * 2. Correo de recuperación de contraseña con código de 6 dígitos
     */
    @Async
    public void enviarCorreoCodigoRecuperacion(Usuario usuario, String codigo) {
        String asunto = "Código de verificación de seguridad — Servitek Perú";
        String cuerpo = String.format(
            "<p class='lead'>Hola %s,</p>" +
            "<p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta asociada a este correo electrónico.</p>" +
            "<p>Ingresa el siguiente código de seguridad de 6 dígitos para completar el proceso. Por motivos de seguridad, este código expirará en 15 minutos.</p>" +
            "<div class='code-box'>%s</div>" +
            "<p class='meta-note'>Si tú no solicitaste el cambio de contraseña, puedes ignorar este mensaje de forma segura. Tu cuenta permanece protegida y no se realizará ninguna modificación.</p>",
            usuario.getNombre(), codigo
        );
        enviarCorreo(usuario.getEmail(), asunto, envolverPlantilla("Recuperación de cuenta", cuerpo));
    }

    /**
     * 3. Correo de confirmación tras cambio exitoso de contraseña
     */
    @Async
    public void enviarCorreoConfirmacionCambioPassword(Usuario usuario) {
        String asunto = "Tu contraseña ha sido actualizada — Servitek Perú";
        String cuerpo = String.format(
            "<p class='lead'>Hola %s,</p>" +
            "<p>Te informamos que la contraseña de tu cuenta de Servitek Perú ha sido modificada con éxito.</p>" +
            "<div class='info-box'>" +
            "  <div class='label'>Cuenta</div>" +
            "  <div class='value'>%s</div>" +
            "  <div class='label' style='margin-top: 12px;'>Estado del sistema</div>" +
            "  <div class='value' style='color: #10B981;'>Contraseña actualizada y sesiones verificadas</div>" +
            "</div>" +
            "<p style='margin-top: 24px;'>Si no realizaste este cambio, por favor ponte en contacto de inmediato con nuestro soporte técnico para proteger tu cuenta.</p>",
            usuario.getNombre(), usuario.getEmail()
        );
        enviarCorreo(usuario.getEmail(), asunto, envolverPlantilla("Seguridad de la cuenta", cuerpo));
    }

    /**
     * 4. Correo de confirmación de pedido (Detalle completo estilo Apple/Stripe)
     */
    @Async
    public void enviarCorreoConfirmacionPedido(Pedido pedido, Usuario usuario) {
        String asunto = "Confirmación de pedido #" + pedido.getId() + " — Servitek Perú";
        
        StringBuilder tablaDetalles = new StringBuilder();
        tablaDetalles.append("<table class='order-table' width='100%' cellpadding='0' cellspacing='0'>");
        tablaDetalles.append("<thead><tr><th align='left'>Descripción</th><th align='center'>Cant.</th><th align='right'>Precio</th><th align='right'>Subtotal</th></tr></thead>");
        tablaDetalles.append("<tbody>");
        
        if (pedido.getDetalles() != null) {
            for (DetallePedido det : pedido.getDetalles()) {
                tablaDetalles.append(String.format(
                    "<tr>" +
                    "  <td class='item-name'>%s</td>" +
                    "  <td align='center'>%d</td>" +
                    "  <td align='right'>S/ %s</td>" +
                    "  <td align='right' style='font-weight: 600;'>S/ %s</td>" +
                    "</tr>",
                    det.getNombreProducto() != null ? det.getNombreProducto() : "Producto del catálogo",
                    det.getCantidad(),
                    formatMoney(det.getPrecioUnitario()),
                    formatMoney(det.getSubtotal())
                ));
            }
        }
        tablaDetalles.append("</tbody>");
        tablaDetalles.append("<tfoot>");
        tablaDetalles.append(String.format(
            "<tr><td colspan='3' align='right' class='total-label'>Total pagado</td><td align='right' class='total-value'>S/ %s</td></tr>",
            formatMoney(pedido.getTotal())
        ));
        tablaDetalles.append("</tfoot></table>");

        String cuerpo = String.format(
            "<p class='lead'>Gracias por tu compra, %s.</p>" +
            "<p>Hemos recibido tu pedido correctamente y ya se encuentra en preparación en nuestro centro de distribución. A continuación te presentamos el detalle de tu orden:</p>" +
            "<div class='info-box' style='margin-bottom: 24px;'>" +
            "  <div class='grid-2'>" +
            "    <div>" +
            "      <div class='label'>Número de orden</div>" +
            "      <div class='value'>#%d</div>" +
            "    </div>" +
            "    <div>" +
            "      <div class='label'>Dirección de envío</div>" +
            "      <div class='value'>%s</div>" +
            "    </div>" +
            "  </div>" +
            "</div>" +
            "%s" +
            "<p style='margin-top: 28px;'>Te notificaremos tan pronto como tu paquete haya sido despachado hacia tu dirección o agencia seleccionada.</p>",
            usuario.getNombre(),
            pedido.getId(),
            obtenerDireccionTexto(pedido, usuario),
            tablaDetalles.toString(),
            construirLineaTiempo(pedido.getEstado())
        );
        enviarCorreo(usuario.getEmail(), asunto, envolverPlantilla("Orden Confirmada #" + pedido.getId(), cuerpo));
    }

    /**
     * 5. Correo de actualización de estado de pedido
     */
    @Async
    public void enviarCorreoActualizacionEstadoPedido(Pedido pedido, Usuario usuario, Pedido.Estado nuevoEstado) {
        String asunto = "Actualización de tu pedido #" + pedido.getId() + " — Servitek Perú";
        String descripcionEstado = obtenerDescripcionEstado(nuevoEstado);

        String cuerpo = String.format(
            "<p class='lead'>Hola %s,</p>" +
            "<p>Hay una novedad respecto a tu orden en Servitek Perú. El estado actual de tu pedido <strong>#%d</strong> ha cambiado:</p>" +
            "<div class='status-card'>" +
            "  <div class='status-title'>Estado actual</div>" +
            "  <div class='status-badge'>%s</div>" +
            "  <div class='status-desc'>%s</div>" +
            "</div>" +
            "%s" +
            "<div class='info-box' style='margin-top: 24px;'>" +
            "  <div class='label'>Dirección registrada para entrega</div>" +
            "  <div class='value'>%s</div>" +
            "</div>" +
            "<p style='margin-top: 24px;'>Si tienes alguna pregunta sobre el transporte o la entrega de tu equipo, contáctanos respondiendo a este mensaje o vía WhatsApp técnico.</p>" +
            "<div style='margin-top: 32px; text-align: center;'>" +
            "  <a href='http://localhost:5173/dashboard' class='btn'>Ver seguimiento y estado en vivo →</a>" +
            "</div>",
            usuario.getNombre(),
            pedido.getId(),
            nuevoEstado.name(),
            descripcionEstado,
            construirLineaTiempo(nuevoEstado),
            obtenerDireccionTexto(pedido, usuario)
        );
        enviarCorreo(usuario.getEmail(), asunto, envolverPlantilla("Estado de Orden #" + pedido.getId(), cuerpo));
    }

    private String construirLineaTiempo(Pedido.Estado estado) {
        if (estado == Pedido.Estado.CANCELADO) {
            return "<div class='status-card' style='border-color: #FECACA; background-color: #FEF2F2; margin: 24px 0;'>" +
                   "  <div class='status-title' style='color: #DC2626;'>Estado del Pedido</div>" +
                   "  <div class='status-badge' style='color: #DC2626;'>ORDEN CANCELADA</div>" +
                   "  <div class='status-desc' style='color: #991B1B;'>Este pedido fue cancelado. Si tienes dudas, comunícate a soporte.</div>" +
                   "</div>";
        }

        boolean step1Done = true;
        boolean step2Done = estado == Pedido.Estado.EN_PROCESO || estado == Pedido.Estado.ENVIADO || estado == Pedido.Estado.ENTREGADO;
        boolean step3Done = estado == Pedido.Estado.ENVIADO || estado == Pedido.Estado.ENTREGADO;
        boolean step4Done = estado == Pedido.Estado.ENTREGADO;

        String step1Class = step1Done && !step2Done ? "active" : "done";
        String step2Class = step2Done && !step3Done ? "active" : (step2Done ? "done" : "pending");
        String step3Class = step3Done && !step4Done ? "active" : (step3Done ? "done" : "pending");
        String step4Class = step4Done ? "done" : "pending";

        String step1Dot = step1Class.equals("done") ? "✓" : "1";
        String step2Dot = step2Class.equals("done") ? "✓" : "2";
        String step3Dot = step3Class.equals("done") ? "✓" : "3";
        String step4Dot = step4Class.equals("done") ? "✓" : "4";

        return "<div class='timeline'>" +
               "  <div class='timeline-step'>" +
               "    <div class='timeline-dot " + step1Class + "'>" + step1Dot + "</div>" +
               "    <div class='timeline-label " + step1Class + "'>Confirmado</div>" +
               "  </div>" +
               "  <div class='timeline-step'>" +
               "    <div class='timeline-dot " + step2Class + "'>" + step2Dot + "</div>" +
               "    <div class='timeline-label " + step2Class + "'>En almacén</div>" +
               "  </div>" +
               "  <div class='timeline-step'>" +
               "    <div class='timeline-dot " + step3Class + "'>" + step3Dot + "</div>" +
               "    <div class='timeline-label " + step3Class + "'>En camino</div>" +
               "  </div>" +
               "  <div class='timeline-step'>" +
               "    <div class='timeline-dot " + step4Class + "'>" + step4Dot + "</div>" +
               "    <div class='timeline-label " + step4Class + "'>Entregado</div>" +
               "  </div>" +
               "</div>";
    }

    private String obtenerDireccionTexto(Pedido pedido, Usuario usuario) {
        if (pedido.getDireccion() != null) {
            pe.edu.utp.ecommerce.model.Direccion dir = pedido.getDireccion();
            return String.format("%s, %s, %s%s",
                    dir.getCalle() != null ? dir.getCalle() : "",
                    dir.getCiudad() != null ? dir.getCiudad() : "",
                    dir.getDepartamento() != null ? dir.getDepartamento() : "",
                    (dir.getReferencia() != null && !dir.getReferencia().isBlank()) ? " (Ref: " + dir.getReferencia() + ")" : "");
        }
        if (usuario.getDireccion() != null && !usuario.getDireccion().isBlank()) {
            return usuario.getDireccion();
        }
        return "Dirección coordinada en tienda / entrega en Surco";
    }

    private String formatMoney(BigDecimal amount) {
        if (amount == null) return "0.00";
        return String.format("%,.2f", amount);
    }

    private String obtenerDescripcionEstado(Pedido.Estado estado) {
        switch (estado) {
            case PENDIENTE:
                return "Tu pedido está registrado y pendiente de validación en almacén.";
            case ENVIADO:
                return "Tu pedido ha salido de nuestro almacén y se encuentra en camino hacia tu dirección de entrega.";
            case ENTREGADO:
                return "El paquete ha sido entregado exitosamente en el destino. Esperamos que disfrutes de tu nuevo equipo.";
            case CANCELADO:
                return "El pedido ha sido cancelado. Si tienes dudas sobre el reembolso o el motivo, contáctanos a soporte.";
            default:
                return "El estado de tu pedido ha sido actualizado por nuestro equipo de logística.";
        }
    }

    /**
     * Plantilla maestra estilo Apple & Nielsen UX:
     * - Estructura limpia de alta fidelidad, paleta neutra (#F5F5F7 fondo, #FFFFFF tarjeta).
     * - Jerarquía tipográfica rigurosa, contraste optimizado sin saturación ni íconos genéricos de IA.
     * - Espaciado respirable (generosos márgenes y padding).
     */
    private String envolverPlantilla(String tituloHeader, String contenidoCuerpo) {
        return "<!DOCTYPE html>" +
               "<html lang='es'>" +
               "<head>" +
               "  <meta charset='UTF-8'>" +
               "  <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
               "  <title>Servitek Perú</title>" +
               "  <style>" +
               "    body { margin: 0; padding: 0; background-color: #F5F5F7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1D1D1F; -webkit-font-smoothing: antialiased; }" +
               "    .wrapper { width: 100%; padding: 48px 16px; background-color: #F5F5F7; }" +
               "    .card { max-width: 580px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E5E5E7; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.04); }" +
               "    .header { padding: 32px 40px 24px 40px; border-bottom: 1px solid #F0F0F2; background-color: #FAFAFC; }" +
               "    .brand { font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #6E6E73; margin: 0 0 8px 0; }" +
               "    .title { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; color: #1D1D1F; margin: 0; line-height: 1.25; }" +
               "    .body { padding: 40px; font-size: 15px; line-height: 1.6; color: #333336; }" +
               "    .lead { font-size: 17px; font-weight: 600; color: #1D1D1F; margin-top: 0; margin-bottom: 16px; }" +
               "    p { margin: 0 0 16px 0; }" +
               "    .info-box { background-color: #F5F5F7; border-radius: 12px; padding: 20px; border: 1px solid #EAEAEA; }" +
               "    .label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #86868B; margin-bottom: 4px; }" +
               "    .value { font-size: 15px; font-weight: 600; color: #1D1D1F; }" +
               "    .grid-2 { display: table; width: 100%; }" +
               "    .grid-2 > div { display: table-cell; width: 50%; vertical-align: top; }" +
               "    .code-box { font-family: 'SF Mono', ui-monospace, Menlo, Monaco, Consolas, monospace; font-size: 32px; font-weight: 700; letter-spacing: 0.25em; text-align: center; background-color: #1D1D1F; color: #FFFFFF; padding: 24px; border-radius: 12px; margin: 28px 0; }" +
               "    .meta-note { font-size: 13px; color: #86868B; line-height: 1.5; margin-top: 24px; }" +
               "    .btn { display: inline-block; background-color: #0071E3; color: #FFFFFF !important; font-size: 14px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 99px; transition: background-color 0.2s; }" +
               "    .order-table { margin-top: 16px; font-size: 14px; border-collapse: collapse; }" +
               "    .order-table th { padding: 12px 8px; border-bottom: 1px solid #E5E5E7; color: #86868B; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }" +
               "    .order-table td { padding: 16px 8px; border-bottom: 1px solid #F0F0F2; color: #1D1D1F; }" +
               "    .order-table .item-name { font-weight: 500; }" +
               "    .order-table tfoot td { padding-top: 20px; border-bottom: none; }" +
               "    .order-table .total-label { font-size: 14px; font-weight: 600; color: #6E6E73; }" +
               "    .order-table .total-value { font-size: 20px; font-weight: 700; color: #1D1D1F; letter-spacing: -0.02em; }" +
               "    .status-card { background-color: #FAFAFC; border: 1px solid #E5E5E7; border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0; }" +
               "    .status-title { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #86868B; margin-bottom: 8px; }" +
               "    .status-badge { display: inline-block; font-size: 18px; font-weight: 700; color: #0071E3; margin-bottom: 8px; }" +
               "    .status-desc { font-size: 14px; color: #515154; margin: 0; }" +
               "    .timeline { display: table; width: 100%; margin: 28px 0; padding: 20px; background-color: #FAFAFC; border-radius: 12px; border: 1px solid #EAEAEA; box-sizing: border-box; }" +
               "    .timeline-step { display: table-cell; width: 25%; text-align: center; vertical-align: top; }" +
               "    .timeline-dot { display: inline-block; width: 26px; height: 26px; line-height: 26px; border-radius: 50%; font-size: 12px; font-weight: 700; margin-bottom: 6px; }" +
               "    .timeline-dot.active { background-color: #0071E3; color: #FFFFFF; box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.15); }" +
               "    .timeline-dot.done { background-color: #10B981; color: #FFFFFF; }" +
               "    .timeline-dot.pending { background-color: #E5E5E7; color: #6E6E73; }" +
               "    .timeline-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; color: #6E6E73; }" +
               "    .timeline-label.active { color: #0071E3; font-weight: 700; }" +
               "    .timeline-label.done { color: #10B981; }" +
               "    .footer { padding: 32px 40px; background-color: #FAFAFC; border-top: 1px solid #F0F0F2; font-size: 12px; line-height: 1.6; color: #86868B; text-align: center; }" +
               "    .footer a { color: #6E6E73; text-decoration: underline; }" +
               "    @media only screen and (max-width: 600px) {" +
               "      .wrapper { padding: 16px 8px; }" +
               "      .header, .body, .footer { padding: 24px 20px; }" +
               "      .code-box { font-size: 26px; letter-spacing: 0.18em; }" +
               "      .grid-2 > div { display: block; width: 100%; margin-bottom: 12px; }" +
               "    }" +
               "  </style>" +
               "</head>" +
               "<body>" +
               "  <div class='wrapper'>" +
               "    <div class='card'>" +
               "      <div class='header'>" +
               "        <div class='brand'>Servitek Perú</div>" +
               "        <h1 class='title'>" + tituloHeader + "</h1>" +
               "      </div>" +
               "      <div class='body'>" +
               "        " + contenidoCuerpo +
               "      </div>" +
               "      <div class='footer'>" +
               "        <p style='margin-bottom: 8px;'>Este mensaje fue enviado de forma automática por el sistema transaccional de <strong>Servitek Perú</strong>.</p>" +
               "        <p style='margin: 0;'>Si tienes preguntas sobre tu cuenta o tus pedidos, comunícate al soporte en <a href='mailto:soporte@servitek.pe'>soporte@servitek.pe</a> o en nuestra tienda en Surco.</p>" +
               "      </div>" +
               "    </div>" +
               "  </div>" +
               "</body>" +
               "</html>";
    }
}
