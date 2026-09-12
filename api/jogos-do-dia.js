/**
 * Função serverless da Vercel.
 *
 * A Vercel detecta automaticamente qualquer arquivo dentro da pasta /api
 * na raiz do projeto e o transforma numa rota de backend — nesse caso,
 * ela fica disponível em: https://SEU-SITE.vercel.app/api/jogos-do-dia
 *
 * A chave da API-Football fica guardada como variável de ambiente
 * (API_FOOTBALL_KEY) configurada no painel da Vercel — NUNCA aqui no
 * código. Assim, ela nunca chega ao navegador do visitante.
 *
 * Como configurar a chave na Vercel:
 *   1. No painel do projeto na Vercel, vá em Settings > Environment Variables.
 *   2. Crie uma variável chamada API_FOOTBALL_KEY com o valor da sua chave.
 *   3. Salve e faça um novo deploy (ou o próximo deploy já pega o valor).
 */

const LEAGUE_ID_BRASILEIRAO_SERIE_A = 71;
const SEASON = 2026;

export default async function handler(req, res) {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    res.status(500).json({
      error: 'A variável de ambiente API_FOOTBALL_KEY não foi configurada no servidor.',
    });
    return;
  }

  try {
    const apiResponse = await fetch(
      `https://v3.football.api-sports.io/fixtures?league=${LEAGUE_ID_BRASILEIRAO_SERIE_A}&season=${SEASON}&next=10`,
      {
        headers: {
          'x-apisports-key': apiKey,
        },
      }
    );

    if (!apiResponse.ok) {
      throw new Error(`A API de futebol respondeu com status ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    const matches = (data.response || []).map((item) => {
      const kickoff = new Date(item.fixture.date);

      return {
        id: item.fixture.id,
        homeTeam: item.teams.home.name,
        homeLogo: item.teams.home.logo,
        awayTeam: item.teams.away.name,
        awayLogo: item.teams.away.logo,
        status: item.fixture.status?.long || 'Agendado',
        date: kickoff.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
        time: kickoff.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/Sao_Paulo',
        }),
        competition: `${item.league.name}${item.league.round ? ' - ' + item.league.round : ''}`,
        stadium: item.fixture.venue?.name
          ? `${item.fixture.venue.name}${item.fixture.venue.city ? ', ' + item.fixture.venue.city : ''}`
          : 'Local a confirmar',
        // A API-Football (plano gratuito) não fornece canal de transmissão.
        // Por isso avisamos o usuário a confirmar na fonte oficial.
        channel: 'Confirme no canal oficial mais próximo do jogo',
      };
    });

    // Cache de 1 hora na borda da Vercel: o site consulta a API-Football no
    // máximo 1x por hora, mesmo que muitas pessoas acessem o site nesse
    // intervalo — importante para não estourar o limite do plano gratuito.
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=1800');
    res.status(200).json({ matches });
  } catch (error) {
    res.status(502).json({
      error: 'Não foi possível buscar os jogos agora. Tente novamente mais tarde.',
    });
  }
}
