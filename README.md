# PULSE Training Club — protótipo comercial

Site demonstrativo de academia criado pela Or7.dev. Marca, preços, horários, aulas,
professores e depoimentos são **fictícios**. Fotografias licenciadas via Unsplash.

## Rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # TypeScript
npm run build      # build de produção em dist/
npm run preview    # serve o build
```

## Adaptar para uma academia real

Todo o conteúdo comercial fica em `src/data/`:

| Arquivo | O que trocar |
| --- | --- |
| `brand.ts` | nome, horários, endereço, redes, número de WhatsApp (`whatsappNumber`) |
| `modalities.ts` | modalidades, textos, benefícios e fotos |
| `facilities.ts` | ambientes da galeria |
| `schedule.ts` | grade semanal de aulas |
| `plans.ts` | preços mensais, desconto anual, benefícios e comparativo |
| `quiz.ts` | perguntas e pontuação do simulador (regra em `src/lib/recommend.ts`) |
| `content.ts` | FAQ e pilares da comunidade |

Cores e tipografia ficam em `src/styles/tokens.css`. As fotos ficam em `public/images/`.

## Comportamentos demonstrativos

- O agendamento não envia nada: monta um resumo e abre o WhatsApp com a mensagem pronta.
  Sem `whatsappNumber`, o WhatsApp pede para escolher o contato.
- Interesse em aulas e planos fica só na memória da página. Apenas o tema é salvo no navegador.
- Os links de redes sociais mostram um aviso até receberem os endereços reais.
- O espaço `[data-or7-watermark]` no rodapé está reservado para a marca d'água oficial.

## Créditos das fotos

Todas as imagens vêm do [Unsplash](https://unsplash.com) e seguem a
[Licença Unsplash](https://unsplash.com/license). Ids em `public/images/CREDITS.md`.


## GitHub Pages

Repositório: `academia-comercial-demo`. Configure Settings > Pages > GitHub Actions.

URL: https://lorenzo-or7.github.io/academia-comercial-demo/
