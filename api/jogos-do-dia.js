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
    // 1. Primeiro, descobrimos qual é a rodada atual do Brasileirão na API-Football
    const roundResponse = await fetch(
      `https://v3.football.api-sports.io/fixtures/rounds?league=${LEAGUE_ID_BRASILEIRAO_SERIE_A}&season=${SEASON}&current=true`,
      {
        headers: {
          'x-apisports-key': apiKey,
        },
      }
    );

    const roundData = await roundResponse.json();
    const currentRound = roundData.response && roundData.response[0];

    // 2. Com a rodada atual descoberta, buscamos todas as partidas dela
    const endpoint = currentRound
      ? `https://v3.football.api-sports.io/fixtures?league=${LEAGUE_ID_BRASILEIRAO_SERIE_A}&season=${SEASON}&round=${encodeURIComponent(currentRound)}`
      : `https://v3.football.api-sports.io/fixtures?league=${LEAGUE_ID_BRASILEIRAO_SERIE_A}&season=${SEASON}&next=10`;

    const apiResponse = await fetch(endpoint, {
      headers: {
        'x-apisports-key': apiKey,
      },
    });

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
        channel: 'Confirme no canal oficial mais próximo do jogo',
      };
    });

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=1800');
    res.status(200).json({ matches });
  } catch (error) {
    res.status(502).json({
      error: 'Não foi possível buscar os jogos agora. Tente novamente mais tarde.',
    });
  }
}
