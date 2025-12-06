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
              <h3><FaMapMarkerAlt /> Entregas GRATUITAS en:</h3>
              <ul>
                <li>Estación Metrotren Lo Blanco 🚅🚅</li>
                <li>Mi Domicilio: Nacimiento 1379 San Bernardo 🏠🏠 </li>
              </ul>
            </div>

                        <div className="delivery-option paid">
              <h3>🛵 Envío a domicilio (cargo adicional):</h3>
              <div className="blue-express-container">
                <p>Costo de envio a domicilio $3.600 ( Gestionado por Blue Express) </p>
                <div className="blue-express-logo-wrapper">
                  <img 
                    src={blueExpressLogo} 
                    alt="Logo Blue Express" 
                    className="blue-express-logo"
                  />
                </div>
              </div>
              <ul>
                {/* <li className="green">🟢 $1.000 – $2.000: San Bernardo, El Bosque, La Cisterna, Lo Espejo, La Pintana</li>
                <li className="yellow">🟡 $2.000 – $3.000: Maipú, Cerrillos, San Miguel, La Florida, Estación Central, PAC</li>
                <li className="orange">🟠 $3.000 – $4.000: Santiago Centro, Providencia, Ñuñoa, Macul, Peñalolén</li>
                <li className="red">🔴 $4.000 – $5.000: Las Condes, Vitacura, Quilicura, Lo Barnechea, Pudahuel, etc.</li> */}
              </ul>
            </div>

          <div className="delivery-option metro">
    <h3>🚇 Entregas en Estación Metro, ⏰ Horario 13:00PM (Domingo) ⏰</h3>
    <ul>
      <li className="metro"> Los Héroes Línea 1 y 2 🔴 🟡: $1.000 (Adicional) </li>
      <li className="metro"> Santa Ana Línea 2 y 5 🟡 🟢: $1.000 (Adicional) </li>
    </ul>
  </div>


          </div>
        </div>

        <div className="payment-section">
          <h2><FaMoneyBillWave /> Información de pago</h2>
          <div className="payment-info">
            <h3>🛍️ Pago en efectivo al retiro:</h3>
            <p>Puedes pagar con el monto justo al momento de retirar tu producto (no manejamos vuelto).</p>
            
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