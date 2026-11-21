import { brand } from '../data/brand'

/**
 * Monta um link seguro para o WhatsApp.
 * Sem número configurado, o wa.me abre o seletor de conversa do próprio
 * WhatsApp com o texto pronto. Nada é enviado automaticamente.
 */
export function whatsappLink(message: string) {
  const text = encodeURIComponent(message.slice(0, 1000))
  const number = brand.whatsappNumber?.replace(/\D/g, '')
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`
}

export const hasWhatsappNumber = () => Boolean(brand.whatsappNumber)
