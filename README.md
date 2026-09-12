# FutBrasil 24H

Site informativo sobre o Campeonato Brasileiro Série A: agenda de jogos,
histórico de clubes e biografias de lendas do futebol brasileiro.

## Tecnologias

- React 18 + Vite
- Tailwind CSS
- lucide-react (ícones)

## Como rodar localmente

```bash
npm install
npm run dev
```

O projeto abre em `http://localhost:5173` (endereço padrão do Vite).

## Como gerar a versão de produção

```bash
npm run build
npm run preview   # opcional, para conferir o build localmente
```

A pasta `dist/` gerada é o que você publica em serviços como Vercel,
Netlify, GitHub Pages ou Cloudflare Pages.

## Avisos importantes antes de publicar de verdade

1. **Dados dos jogos são fixos, não automáticos.**
   A lista de partidas em `src/App.jsx` (`BRAZILIAN_MATCHES`) foi conferida
   manualmente em fontes noticiosas em 12/09/2026, referente à 27ª rodada.
   Ela **não se atualiza sozinha**. Antes de publicar, confira os horários
   e canais na fonte oficial (CBF) e, quando a rodada mudar, atualize essa
   lista — ou siga o passo a passo abaixo para conectar uma API de verdade.

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
   Antes de publicar para valer, considere substituir por imagens obtidas
   diretamente com os clubes ou por um banco de imagens com licença.

## Como conectar uma API de futebol de verdade (próximo passo)

O arquivo `src/api/footballApi.js` já deixa o esqueleto pronto, mas **não
integrado** ainda. Resumo do caminho:

1. Criar conta gratuita em https://dashboard.api-football.com/
2. Guardar a chave da API em uma variável de ambiente do lado do
   servidor (nunca direto no código do site) — veja `.env.example`.
3. Criar uma função de backend/serverless (Vercel, Netlify, Cloudflare
   Workers etc.) que usa essa chave para consultar a API-Football e
   expõe uma rota sua, por exemplo `/api/jogos-do-dia`.
4. Fazer `src/api/footballApi.js` chamar essa SUA rota.
5. Em `src/App.jsx`, trocar a constante `BRAZILIAN_MATCHES` por um
   `useState` + `useEffect` que chama essa função ao carregar a página.

Isso evita expor sua chave de API publicamente no navegador do visitante.

## Estrutura de pastas

```
futbrasil-24h/
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
        └── footballApi.js   (esqueleto para integração futura)
```
