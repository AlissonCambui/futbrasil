/**
 * Busca os próximos jogos do Brasileirão através da SUA função serverless
 * (api/jogos-do-dia.js), que é quem realmente conversa com a API-Football
 * usando a chave secreta guardada na Vercel.
 *
 * Este arquivo nunca vê nem usa a chave da API diretamente — só chama a
 * sua própria rota (/api/jogos-do-dia).
 */
export async function fetchTodaysMatches() {
  const response = await fetch('/api/jogos-do-dia');

  if (!response.ok) {
    throw new Error('Não foi possível carregar os jogos agora.');
  }

  const data = await response.json();
  return data.matches;
}
