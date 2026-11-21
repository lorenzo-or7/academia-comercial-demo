import type { FaqItem } from '../types'

export const faq: FaqItem[] = [
  {
    id: 'trial',
    question: 'Posso fazer uma aula experimental?',
    answer:
      'Sim. Agende uma visita nesta página e indique a modalidade que quer conhecer. A equipe confirma o horário e você treina uma vez sem compromisso.',
  },
  {
    id: 'no-commitment',
    question: 'Existem planos sem fidelidade?',
    answer:
      'Todos os planos podem ser contratados no formato mensal, sem fidelidade. O formato anual tem desconto em troca do compromisso de 12 meses.',
  },
  {
    id: 'coaching',
    question: 'A academia oferece acompanhamento?',
    answer:
      'Há instrutores no salão durante todo o funcionamento. Cada plano inclui reavaliações físicas periódicas, e o Unlimited soma uma sessão individual por mês.',
  },
  {
    id: 'classes',
    question: 'Posso participar das aulas coletivas?',
    answer:
      'Os planos Performance e Unlimited incluem aulas coletivas e funcionais. A vaga é reservada pela grade, e as turmas aceitam todos os níveis, salvo indicação.',
  },
  {
    id: 'hours',
    question: 'Quais são os horários de funcionamento?',
    answer:
      'Segunda a sexta, das 5h às 23h. Sábado, das 8h às 18h. Domingos e feriados, fechado. Horários ilustrativos desta demonstração.',
  },
  {
    id: 'cancel',
    question: 'Como funciona o cancelamento?',
    answer:
      'No mensal, basta avisar com 30 dias de antecedência. No anual, as condições de cancelamento antecipado ficam descritas no contrato entregue na matrícula.',
  },
]

export const communityPillars = [
  {
    title: 'Instrutor no salão',
    text: 'Sempre tem alguém para corrigir a postura, ajustar a carga ou sugerir a próxima série.',
  },
  {
    title: 'Reavaliação periódica',
    text: 'Medidas e testes refeitos em datas marcadas, para o treino mudar quando você mudar.',
  },
  {
    title: 'Turmas com rosto conhecido',
    text: 'Horários fixos fazem as mesmas pessoas se encontrarem e cobrarem presença umas das outras.',
  },
  {
    title: 'Encontros abertos',
    text: 'Aulões de sábado e desafios internos para quem gosta de treinar fora da rotina.',
  },
]
