import type { Modality, ModalityId } from '../types'

export const modalities: Modality[] = [
  {
    id: 'musculacao',
    name: 'Musculação',
    focus: 'Força e hipertrofia',
    format: 'Treino individual com ficha e instrutor no salão',
    description:
      'Equipamentos de carga livre e máquinas guiadas, com um treino montado para o seu nível e revisado ao longo dos meses.',
    benefits: [
      'Ficha de treino montada por instrutor',
      'Racks, plataformas e halteres até 50 kg',
      'Progressão de carga acompanhada',
    ],
    image: `${import.meta.env.BASE_URL}images/mod-musculacao.jpg`,
    imageAlt: 'Aluna de costas posicionando a barra nos ombros dentro do rack de musculação',
  },
  {
    id: 'funcional',
    name: 'Funcional',
    focus: 'Movimento e potência',
    format: 'Circuitos em estações, turmas pequenas',
    description:
      'Circuitos com cordas, kettlebells e peso corporal para ganhar condicionamento, coordenação e força que você usa no dia a dia.',
    benefits: [
      'Turmas reduzidas com professor dedicado',
      'Treinos diferentes a cada semana',
      'Adaptações para cada nível',
    ],
    image: `${import.meta.env.BASE_URL}images/mod-funcional.jpg`,
    imageAlt: 'Pessoa treinando com cordas navais em área funcional da academia',
  },
  {
    id: 'cardio',
    name: 'Cardio',
    focus: 'Fôlego e resistência',
    format: 'Esteiras, bikes e remos com treinos por zona',
    description:
      'Esteiras, bicicletas e remos para treinar fôlego no seu ritmo, com sessões guiadas por zonas de intensidade.',
    benefits: [
      'Equipamentos com monitoramento de ritmo',
      'Sessões guiadas de corrida e bike',
      'Bom complemento para qualquer objetivo',
    ],
    image: `${import.meta.env.BASE_URL}images/mod-cardio.jpg`,
    imageAlt: 'Mulher correndo em uma esteira em ambiente de academia iluminado',
  },
  {
    id: 'coletivas',
    name: 'Aulas coletivas',
    focus: 'Energia em grupo',
    format: 'Turmas com horário fixo na grade semanal',
    description:
      'Bike indoor, ritmos, pilates solo e alongamento em turmas com horário marcado. Quem treina junto costuma voltar no dia seguinte.',
    benefits: [
      'Grade com aulas de manhã, almoço e noite',
      'Sem experiência prévia necessária',
      'Reserva de vaga pelo site',
    ],
    image: `${import.meta.env.BASE_URL}images/mod-coletivas.jpg`,
    imageAlt: 'Turma de alunas em aula coletiva com braços erguidos e música',
  },
]

export const modalityById = Object.fromEntries(modalities.map((m) => [m.id, m])) as Record<
  ModalityId,
  Modality
>
