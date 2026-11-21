/**
 * Identidade e contatos da academia.
 * Tudo aqui é fictício. Para adaptar a um cliente real, troque os valores
 * deste arquivo — os componentes leem apenas daqui.
 */
export const brand = {
  name: 'PULSE',
  fullName: 'PULSE Training Club',
  descriptor: 'Training Club',
  /** Número no formato internacional, só dígitos (ex.: 5511999990000).
   *  Enquanto for null, os botões de WhatsApp abrem o seletor de conversa
   *  do próprio WhatsApp com a mensagem pronta, sem destinatário. */
  whatsappNumber: null as string | null,
  addressLabel: 'Unidade demonstrativa',
  address: 'Endereço da unidade será inserido aqui',
  hours: [
    { days: 'Segunda a sexta', time: '5h às 23h' },
    { days: 'Sábado', time: '8h às 18h' },
    { days: 'Domingo e feriados', time: 'Fechado' },
  ],
  social: [
    { id: 'instagram', label: 'Instagram' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'tiktok', label: 'TikTok' },
  ],
  credits: {
    studio: 'Or7.dev',
    signature: 'Experience crafted by Or7.dev',
  },
} as const

export const navItems = [
  { id: 'modalidades', label: 'Modalidades' },
  { id: 'estrutura', label: 'Estrutura' },
  { id: 'aulas', label: 'Aulas' },
  { id: 'planos', label: 'Planos' },
  { id: 'contato', label: 'Contato' },
] as const
