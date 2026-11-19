export const WHATSAPP_NUMBER = '56966367967';

// Link de WhatsApp con el mensaje ya escrito (si se pasa un producto, incluye su nombre y precio)
export const whatsappLink = (product) => {
  const text = product
    ? `Hola! Vengo de la página web y me interesa: ${product.name} (${product.price}). ¿Está disponible?`
    : 'Hola! Vengo de la página web y quiero hacer un pedido';
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
};

export const DELIVERY_OPTIONS = [
  { icon: '🚇', title: 'Metro Lo Blanco', text: 'Entrega GRATIS', detail: 'Lunes a jueves, 14:00–16:00' },
  { icon: '🏠', title: 'Retiro San Bernardo', text: 'GRATIS', detail: 'Cualquier día, coordinando horario' },
  { icon: '📦', title: 'Blue Express', text: '$2.900', detail: 'Envío a domicilio, aprox. 48 h' },
  { icon: '💳', title: 'Pago', text: 'Transferencia o efectivo', detail: 'Datos bancarios solo por WhatsApp' },
];
