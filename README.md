# FutBrasil 24H

Site informativo sobre o Campeonato Brasileiro Série A: agenda de jogos
(agora buscada automaticamente pela API-Football), histórico de clubes e
biografias de lendas do futebol brasileiro.

## Tecnologias

- React 18 + Vite
- Tailwind CSS
- lucide-react (ícones)
- Função serverless da Vercel (`api/jogos-do-dia.js`) para buscar os jogos
  na API-Football sem expor a chave no navegador

## Como rodar localmente

```bash
npm install
npm run dev
```

O projeto abre em `http://localhost:5173` (endereço padrão do Vite).

**Atenção:** rodando só com `npm run dev`, a função `api/jogos-do-dia.js`
não é executada (isso é recurso da Vercel). Localmente, o site vai cair
automaticamente no aviso de "dados de reserva" — isso é esperado. Para
testar a função de verdade localmente, use a CLI da Vercel:

```bash
npm install -g vercel
vercel dev
```

E crie um arquivo `.env` (baseado no `.env.example`) com sua chave da
API-Football antes de rodar `vercel dev`.

## Como publicar na Vercel

1. Importe este repositório do GitHub no painel da Vercel
   (https://vercel.com/new). A Vercel detecta automaticamente que é um
   projeto Vite.
2. Antes ou depois do primeiro deploy, vá em
   **Project Settings > Environment Variables** e crie:
   - Nome: `API_FOOTBALL_KEY`
   - Valor: a sua chave da conta em https://dashboard.api-football.com/
3. Clique em **Deploy** (ou refaça o deploy, se já tinha feito antes de
   configurar a variável).
4. Pronto — o site vai buscar os próximos jogos do Brasileirão
   automaticamente através da sua função `/api/jogos-do-dia`.

## Como a busca de jogos funciona

- O front-end (`src/App.jsx`) chama `fetchTodaysMatches()`
  (`src/api/footballApi.js`) assim que a página carrega.
- Essa função chama a SUA própria rota `/api/jogos-do-dia`.
- Essa rota é uma função serverless (`api/jogos-do-dia.js`) que roda no
  servidor da Vercel, usa a chave guardada em variável de ambiente para
  perguntar à API-Football quais são os próximos 10 jogos do Brasileirão
  Série A, e devolve isso já formatado para o site.
- A resposta fica em cache por 1 hora na borda da Vercel
  (`Cache-Control: s-maxage=3600`), então mesmo com muitos visitantes,
  sua chave só é realmente usada, no máximo, 24 vezes por dia — dentro
  do limite do plano gratuito da API-Football (100 requisições/dia).
- Se a busca falhar por qualquer motivo (chave não configurada, API fora
  do ar, etc.), o site mostra automaticamente uma lista de reserva fixa
  no código, com um aviso visível de que os dados podem estar
  desatualizados. Assim o site nunca fica com a tela vazia.

## Avisos importantes antes de publicar de vez

1. **Canal de transmissão não vem da API gratuita.**
   A API-Football (plano gratuito) não informa em qual canal o jogo passa.
   Por isso, os jogos buscados ao vivo mostram uma mensagem pedindo para
   confirmar no canal oficial, em vez de um nome de canal específico.
   (A lista de reserva no código, essa sim, tem canais reais conferidos
   manualmente para a 27ª rodada — mas eles ficam desatualizados com o
   tempo.)

2. **Bloco de anúncios é só um espaço reservado.**
   O componente `AdPlaceholder` não carrega o script oficial do Google
   AdSense. Para monetizar de verdade, depois de ter sua conta aprovada:
   - adicione a tag `<script>` oficial do AdSense (com seu ID de editor)
     no `<head>` do `index.html`;
   - publique o arquivo `ads.txt` exigido pelo Google no seu domínio;
   - só então troque o placeholder pelo componente `<ins class="adsbygoogle">`
     oficial.

3. **Escudos dos clubes vêm de um link do Google (`ssl.gstatic.com`), não
   de uma fonte oficial.** Isso funciona para testar, mas é um link que
   pode parar de funcionar a qualquer momento e não é uma fonte licenciada.
   Os escudos que vierem da API-Football (para os jogos buscados ao vivo)
   já são fornecidos oficialmente pela própria API. Para os clubes e
   jogadores (seções de história), considere substituir por imagens
   obtidas diretamente com os clubes ou por um banco de imagens com
   licença antes de publicar para valer.

## Estrutura de pastas

```
futbrasil-24h/
├── api/
│   └── jogos-do-dia.js      (função serverless da Vercel — usa a chave)
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── .env.example
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx
    └── api/
        └── footballApi.js   (chama a SUA rota /api/jogos-do-dia)
```
