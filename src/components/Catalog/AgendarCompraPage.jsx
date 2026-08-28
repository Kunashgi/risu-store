import React from 'react';
import { FaWhatsapp, FaMoneyBillWave, FaTruck, FaMapMarkerAlt, FaLock} from 'react-icons/fa';
import blueExpressLogo from '../../assets/images/page/blue-express-logo.png';
import './AgendarCompraPage.css';

const AgendarCompra = () => {
  const whatsappNumber = "+56966367967";
  const whatsappMessage = encodeURIComponent(`Hola! Vengo de la pagina Web y necesito generar un pedido`);

  return (
    <div className="agendar-compra-page">

      <div className="agendar-content">
        <div className="info-section">
          <h1><FaWhatsapp className="whatsapp-icon" /> Agenda tu compra por WhatsApp         </h1>

          <a 
          href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
          className="whatsapp-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp /> Contactar por WhatsApp
        </a>

          {/* Nueva sección de políticas de envío */}
          {/* <div className="shipping-policy">
            <h2><FaBoxes /> Políticas de envío (Coordinar por WhatsApp)</h2>
            <div className="policy-item">
              <h3>📦 Envío múltiple:</h3>
              <p>Si compras más de 1 producto, el costo de envío será único (no tiene costo adicional por productos extras).</p>
            </div>
            <div className="policy-item free-shipping">
              <h3>🚚 Envío gratis:</h3>
              <p>¡Por compras sobre $21.000 CLP el envío a domicilio es totalmente gratis! (Válido para todas las comunas, Región Metropolitana)</p>
            </div>
          </div> */}

          <div className="delivery-section">
            <h2><FaTruck /> Opciones de entrega</h2>

            <div className="delivery-option free">
              <h3><FaMapMarkerAlt /> Retiro GRATIS</h3>
              <p>Cualquier día en Nacimiento 1379, San Bernardo (solo coordinar horario).</p>
            </div>

            <div className="delivery-option free">
              <h3>🚇 Entrega GRATIS en Metro Lo Blanco</h3>
              <p>Lunes a jueves, 14:00–16:00.</p>
            </div>

            <div className="delivery-option paid">
              <h3>📦 Envío a domicilio por Blue Express</h3>
              <div className="blue-express-container">
                <p>Desde $2.900 (según producto). Demora aprox. 48 h desde el despacho.</p>
                <div className="blue-express-logo-wrapper">
                  <img
                    src={blueExpressLogo}
                    alt="Logo Blue Express"
                    className="blue-express-logo"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-section">
          <h2><FaMoneyBillWave /> Información de pago</h2>
          <div className="payment-info">
            <h3>🛍️ Pago en efectivo al retiro:</h3>
            <p>Puedes pagar con el monto justo al momento de retirar tu producto</p>
            
            <div className="protected-data">
              <FaLock className="lock-icon" />
              <h3>💳 Transferencia bancaria:</h3>
              <p>Para coordinar pago por transferencia, solicita los datos bancarios por WhatsApp.</p>
              <p className="security-note">🔒 Por seguridad, los datos de transferencia se comparten solo por mensaje directo.</p>
            </div>

            <p>📞 Necesitaré datos personales para coordinar la entrega.</p>
          </div>
        </div>

        <a 
          href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
          className="whatsapp-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp /> Contactar por WhatsApp
        </a>
      </div>
    </div>
  );
};

export default AgendarCompra;