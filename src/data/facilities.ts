import type { Facility } from '../types'

export const facilities: Facility[] = [
  {
    id: 'musculacao',
    title: 'Área de musculação',
    description:
      'Salão amplo com racks, plataformas de levantamento e linha completa de máquinas guiadas.',
    image: `${import.meta.env.BASE_URL}images/est-musculacao.jpg`,
    alt: 'Salão de musculação amplo com pé-direito alto, máquinas e iluminação industrial',
  },
  {
    id: 'funcional',
    title: 'Zona funcional',
    description: 'Piso de grama sintética, barras olímpicas, cordas e espaço livre para circuitos.',
    image: `${import.meta.env.BASE_URL}images/est-funcional.jpg`,
    alt: 'Barra olímpica com anilhas sobre piso de grama sintética na zona funcional',
  },
  {
    id: 'cardio',
    title: 'Espaço cardiovascular',
    description: 'Esteiras e bikes posicionadas junto às janelas, com luz natural durante o dia.',
    image: `${import.meta.env.BASE_URL}images/est-cardio.jpg`,
    alt: 'Fileira de esteiras e bancos de treino diante de janelas amplas, em preto e branco',
  },
  {
    id: 'alongamento',
    title: 'Área de alongamento',
    description: 'Sala com colchonetes e acessórios para mobilidade, pilates solo e volta à calma.',
    image: `${import.meta.env.BASE_URL}images/est-alongamento.jpg`,
    alt: 'Duas alunas fazendo exercícios de solo sobre colchonetes em sala clara',
  },
  {
    id: 'vestiarios',
    title: 'Vestiários',
    description: 'Armários individuais, bancos amplos e duchas para sair direto para o trabalho.',
    image: `${import.meta.env.BASE_URL}images/est-vestiario.jpg`,
    alt: 'Vestiário com armários escuros e bancos de madeira, iluminação baixa',
  },
]
