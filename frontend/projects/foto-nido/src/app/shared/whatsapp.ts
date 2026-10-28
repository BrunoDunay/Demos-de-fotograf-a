/** Arma el enlace de WhatsApp. Sin número: WhatsApp deja elegir el contacto (es una demo). */
export function whatsappLink(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
