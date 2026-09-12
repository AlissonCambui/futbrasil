import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  BookOpen, 
  Search, 
  Clock, 
  Shield, 
  Award, 
  Activity, 
  Menu, 
  X,
  ChevronRight,
  Flame,
  Tv,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { fetchTodaysMatches } from './api/footballApi.js';

/**
 * DADOS DE RESERVA (FALLBACK), NÃO A FONTE PRINCIPAL
 * Desde que a API-Football foi conectada (veja api/jogos-do-dia.js e
 * src/api/footballApi.js), esta lista só é usada se, por algum motivo,
 * a busca à API falhar (ex: chave não configurada, API fora do ar).
 * Ela foi conferida manualmente em fontes noticiosas em 12/09/2026,
 * referente à 27ª rodada do Campeonato Brasileiro Série A 2026, e por
 * isso tende a ficar desatualizada com o tempo — é só um plano B.
 */
const BRAZILIAN_MATCHES = [
  {
    id: 1,
    homeTeam: "Atlético-MG",
    homeLogo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/q9fhEsgpuyRq58OgmSndcQ_500x500.png",
    awayTeam: "Fluminense",
    awayLogo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/fCMxMMDF2AZPU7LzYKSlig_500x500.png",
    status: "AGENDADO",
    date: "12/09/2026",
    time: "16:00",
    competition: "Campeonato Brasileiro - Série A (27ª rodada)",
    stadium: "Arena MRV, Belo Horizonte",
    channel: "Premiere"
  },
  {
    id: 2,
    homeTeam: "Grêmio",
    homeLogo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/Ku-73v_TW9kpex-IEGb0ZA_500x500.png",
    awayTeam: "Vasco da Gama",
    awayLogo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/hHwT8LwRmYCAGxQ-STLxYA_500x500.png",
    status: "AGENDADO",
    date: "12/09/2026",
    time: "16:00",
    competition: "Campeonato Brasileiro - Série A (27ª rodada)",
    stadium: "Arena do Grêmio, Porto Alegre",
    channel: "Premiere"
  },
  {
    id: 3,
    homeTeam: "Chapecoense",
    homeLogo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/K7JQUKTRsuXfO9YrD5dq5g_500x500.png",
    awayTeam: "Internacional",
    awayLogo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/OWVFKuHrQuf4q2Wk0hEmSA_500x500.png",
    status: "AGENDADO",
    date: "12/09/2026",
    time: "17:00",
    competition: "Campeonato Brasileiro - Série A (27ª rodada)",
    stadium: "Arena Condá, Chapecó",
    channel: "Record, YouTube (CazéTV) e Premiere"
  },
  {
    id: 4,
    homeTeam: "Palmeiras",
    homeLogo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/7spurne-xDt2p6C0imYYNA_500x500.png",
    awayTeam: "São Paulo",
    awayLogo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/4w2Z97Hf9CSOqICK3a8AxQ_500x500.png",
    status: "AGENDADO",
    date: "12/09/2026",
    time: "18:30",
    competition: "Campeonato Brasileiro - Série A (27ª rodada)",
    stadium: "Nubank Parque, São Paulo",
    channel: "Premiere"
  },
  {
    id: 5,
    homeTeam: "Botafogo",
    homeLogo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/KLDWYp-H8CAOT9H_JgizRg_500x500.png",
    awayTeam: "Red Bull Bragantino",
    awayLogo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/lMyw2zn1Z4cdkaxKJWnsQw_500x500.png",
    status: "AGENDADO",
    date: "12/09/2026",
    time: "20:30",
    competition: "Campeonato Brasileiro - Série A (27ª rodada)",
    stadium: "Estádio Nilton Santos, Rio de Janeiro",
    channel: "Prime Video"
  },
  {
    id: 6,
    homeTeam: "Santos",
    homeLogo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/VHdNOT6wWOw_vJ38GMjMzg_500x500.png",
    awayTeam: "Cruzeiro",
    awayLogo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/Tcv9X__nIh-6wFNJPMwIXQ_500x500.png",
    status: "AGENDADO",
    date: "12/09/2026",
    time: "21:00",
    competition: "Campeonato Brasileiro - Série A (27ª rodada)",
    stadium: "Vila Belmiro, Santos",
    channel: "SporTV e Premiere"
  },
  {
    id: 7,
    homeTeam: "Flamengo",
    homeLogo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/orE554NToSkH6nuwofe7Yg_500x500.png",
    awayTeam: "Corinthians",
    awayLogo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/tCMSqgXVHROpdCpQhzTo1g_500x500.png",
    status: "AGENDADO",
    date: "13/09/2026",
    time: "17:30",
    competition: "Campeonato Brasileiro - Série A (27ª rodada)",
    stadium: "Maracanã, Rio de Janeiro",
    channel: "TV Globo, ge TV e Premiere"
  }
];

const CLUBS_DATA = [
  {
    id: "flamengo",
    name: "Clube de Regatas do Flamengo",
    logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/orE554NToSkH6nuwofe7Yg_500x500.png",
    founded: "1895",
    state: "Rio de Janeiro",
    stadium: "Maracanã",
    history: "Fundado como um clube de remo em 1895, o Flamengo tornou-se uma das maiores potências mundiais do futebol. Dono de uma torcida apaixonada, conquistou múltiplos Brasileiros, Libertadores e o Mundial Intercontinental de 1981.",
    highlights: ["3x Copa Libertadores", "8x Campeonato Brasileiro (CBF)", "1x Mundial Intercontinental"]
  },
  {
    id: "palmeiras",
    name: "Sociedade Esportiva Palmeiras",
    logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/7spurne-xDt2p6C0imYYNA_500x500.png",
    founded: "1914",
    state: "São Paulo",
    stadium: "Nubank Parque",
    history: "Fundado como Palestra Itália por imigrantes italianos em 1914. É o maior campeão do Campeonato Brasileiro da história, com eras lendárias como a Academia de Futebol e conquistas continentais expressivas.",
    highlights: ["3x Copa Libertadores", "12x Campeonato Brasileiro", "4x Copa do Brasil"]
  },
  {
    id: "santos",
    name: "Santos Futebol Clube",
    logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/VHdNOT6wWOw_vJ38GMjMzg_500x500.png",
    founded: "1912",
    state: "São Paulo",
    stadium: "Vila Belmiro",
    history: "O clube da Vila Belmiro encantou o planeta nos anos 1950 e 1960 liderado pelo Rei Pelé. É reconhecido mundialmente como o berço dos Meninos da Vila e celeiro de craques históricos.",
    highlights: ["3x Copa Libertadores", "8x Campeonato Brasileiro", "2x Mundiais Interclubes"]
  },
  {
    id: "sao-paulo",
    name: "São Paulo Futebol Clube",
    logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/4w2Z97Hf9CSOqICK3a8AxQ_500x500.png",
    founded: "1930",
    state: "São Paulo",
    stadium: "MorumBIS",
    history: "Tricampeão mundial e continental, o São Paulo é sinônimo de organização e vocação para grandes decisões. Venceu eras de ouro com Telê Santana e grandes ídolos como Raí, Rogério Ceni e Kaká.",
    highlights: ["3x Copa Libertadores", "3x Mundial / Intercontinental", "6x Campeonato Brasileiro"]
  },
  {
    id: "corinthians",
    name: "Sport Club Corinthians Paulista",
    logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/tCMSqgXVHROpdCpQhzTo1g_500x500.png",
    founded: "1910",
    state: "São Paulo",
    stadium: "Neo Química Arena",
    history: "Fundado por operários no Bom Retiro em 1910, o Corinthians possui uma das torcidas mais fiéis e fervorosas do mundo (a Fiel). É bicampeão mundial FIFA e ícone cultural do esporte.",
    highlights: ["2x Mundial de Clubes FIFA", "1x Copa Libertadores", "7x Campeonato Brasileiro"]
  },
  {
    id: "gremio",
    name: "Grêmio Foot-Ball Porto Alegrense",
    logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/Ku-73v_TW9kpex-IEGb0ZA_500x500.png",
    founded: "1903",
    state: "Rio Grande do Sul",
    stadium: "Arena do Grêmio",
    history: "Marcado pela raça copeira e tradição em mata-matas, o Grêmio é tricampeão da América e celeiro de ídolos eternos como Renato Portaluppi e Ronaldinho.",
    highlights: ["3x Copa Libertadores", "2x Campeonato Brasileiro", "1x Copa Intercontinental"]
  },
  {
    id: "internacional",
    name: "Sport Club Internacional",
    logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/OWVFKuHrQuf4q2Wk0hEmSA_500x500.png",
    founded: "1909",
    state: "Rio Grande do Sul",
    stadium: "Beira-Rio",
    history: "O Clube do Povo conquistou o Brasileirão invicto em 1979 e atingiu o topo do mundo em 2006 ao derrotar o Barcelona no Japão com atuação memorável.",
    highlights: ["2x Copa Libertadores", "1x Mundial de Clubes FIFA", "3x Campeonato Brasileiro"]
  },
  {
    id: "atletico-mg",
    name: "Clube Atlético Mineiro",
    logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/q9fhEsgpuyRq58OgmSndcQ_500x500.png",
    founded: "1908",
    state: "Minas Gerais",
    stadium: "Arena MRV",
    history: "O Galo possui uma torcida extremamente vibrante. Venceu a Libertadores de 2013 em campanha heroica e briga sempre no topo do futebol brasileiro.",
    highlights: ["1x Copa Libertadores", "2x Campeonato Brasileiro", "2x Copa do Brasil"]
  },
  {
    id: "cruzeiro",
    name: "Cruzeiro Esporte Clube",
    logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/Tcv9X__nIh-6wFNJPMwIXQ_500x500.png",
    founded: "1921",
    state: "Minas Gerais",
    stadium: "Mineirão",
    history: "Um dos maiores campeões da Copa do Brasil e pentacampeão nacional, a Raposa revelou craques históricos como Tostão, Dirceu Lopes e Ronaldo.",
    highlights: ["2x Copa Libertadores", "4x Campeonato Brasileiro", "6x Copa do Brasil"]
  },
  {
    id: "fluminense",
    name: "Fluminense Football Club",
    logo: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/fCMxMMDF2AZPU7LzYKSlig_500x500.png",
    founded: "1902",
    state: "Rio de Janeiro",
    stadium: "Maracanã",
    history: "Berço da Seleção Brasileira em suas origens, o Tricolor carioca conquistou a glória eterna da Libertadores em 2023, consagrando uma história de elegância e futebol arte.",
    highlights: ["1x Copa Libertadores", "4x Campeonato Brasileiro", "1x Copa do Brasil"]
  }
];

const PLAYERS_DATA = [
  {
    id: "pele",
    name: "Edson Arantes do Nascimento (Pelé)",
    nickname: "O Rei do Futebol",
    era: "1950 - 1977",
    teams: "Santos, New York Cosmos, Seleção Brasileira",
    bio: "Considerado por muitos o maior atleta de todos os tempos. Único tricampeão mundial pela Seleção (1958, 1962 e 1970). Marcou mais de 1.000 gols na carreira.",
    stats: "Mais de 1.000 gols em partidas oficiais e amistosas."
  },
  {
    id: "ronaldo",
    name: "Ronaldo Luís Nazário de Lima",
    nickname: "O Fenômeno",
    era: "1993 - 2011",
    teams: "Cruzeiro, Barcelona, Inter de Milão, Real Madrid, Milan, Corinthians",
    bio: "Um dos atacantes mais devastadores da história. Dono de uma velocidade e técnica incomparáveis, foi bicampeão do mundo e duas vezes eleito Melhor do Mundo pela FIFA.",
    stats: "Artilheiro histórico em Copas do Mundo e ícone global do futebol."
  },
  {
    id: "zico",
    name: "Arthur Antunes Coimbra",
    nickname: "O Galinho de Quintino",
    era: "1971 - 1994",
    teams: "Flamengo, Udinese, Kashima Antlers",
    bio: "Um dos maiores ídolos do Flamengo, reconhecido pela precisão nas cobranças de falta e pela visão de jogo.",
    stats: "Mais de 500 gols oficiais na carreira."
  },
  {
    id: "ronaldinho",
    name: "Ronaldo de Assis Moreira",
    nickname: "Ronaldinho Gaúcho (R10)",
    era: "1998 - 2015",
    teams: "Grêmio, Barcelona, Milan, Atlético-MG",
    bio: "Conhecido pela alegria de jogo e dribles característicos. Venceu a Champions League e foi duas vezes eleito o melhor jogador do mundo pela FIFA.",
    stats: "Melhor do Mundo FIFA (2004, 2005) e Campeão do Mundo (2002)."
  },
  {
    id: "romario",
    name: "Romário de Souza Faria",
    nickname: "O Baixinho",
    era: "1985 - 2009",
    teams: "Vasco, PSV, Barcelona, Flamengo, Fluminense",
    bio: "Um dos maiores finalizadores da história do futebol brasileiro. Decisivo na conquista do tetracampeonato mundial de 1994.",
    stats: "Mais de 700 gols reconhecidos oficialmente pela CBF/FIFA ao longo da carreira."
  },
  {
    id: "garrincha",
    name: "Manuel Francisco dos Santos",
    nickname: "O Anjo das Pernas Tortas",
    era: "1953 - 1972",
    teams: "Botafogo, Seleção Brasileira",
    bio: "Reconhecido como um dos maiores dribladores da história do esporte. Teve papel central no título da Copa de 1962 no Chile.",
    stats: "Bicampeão Mundial (1958 e 1962)."
  },
  {
    id: "kaka",
    name: "Ricardo Izecson dos Santos Leite",
    nickname: "Kaká",
    era: "2001 - 2017",
    teams: "São Paulo, Milan, Real Madrid",
    bio: "Meio-campista conhecido pela elegância e por arrancadas decisivas. Foi o último jogador a vencer a Bola de Ouro antes da era Messi/Cristiano Ronaldo.",
    stats: "Melhor do Mundo FIFA e Bola de Ouro em 2007."
  }
];

/**
 * Espaço reservado para anúncios.
 *
 * IMPORTANTE: este componente é apenas um placeholder visual. Ele NÃO carrega
 * o script oficial do Google AdSense (adsbygoogle.js), então nenhum anúncio
 * real será exibido só com este código. Para monetizar de verdade, depois de
 * ter sua conta aprovada no Google AdSense você precisa, no HTML principal do
 * seu site (fora deste componente React):
 *   1. Adicionar a tag <script> oficial do AdSense com o SEU ID de editor no
 *      <head> da página.
 *   2. Publicar o arquivo ads.txt exigido pelo Google no seu domínio.
 *   3. Só então usar <ins class="adsbygoogle"> nos blocos onde os anúncios
 *      devem aparecer.
 * Substitua o ID abaixo pelo ID real da sua conta antes de publicar.
 */
function AdPlaceholder({ slotTitle = "Espaço para anúncio", format = "horizontal" }) {
  return (
    <div className="my-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden">
      <div className="absolute top-1 right-2 flex items-center gap-1">
        <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
          Espaço reservado — integração de anúncios pendente
        </span>
      </div>
      <div className={`flex flex-col items-center justify-center border border-dashed border-slate-700/60 rounded-lg bg-slate-950/40 p-6 ${format === 'horizontal' ? 'h-24' : 'h-48'}`}>
        <div className="flex items-center gap-2 text-slate-400 mb-1">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-bold tracking-wide">{slotTitle}</span>
        </div>
        <p className="text-xs text-slate-500 text-center max-w-md">
          Este bloco será substituído por um anúncio real depois que você configurar
          o script oficial do Google AdSense no seu site publicado.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [matches, setMatches] = useState(BRAZILIAN_MATCHES);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isActive = true;

    fetchTodaysMatches()
      .then((liveMatches) => {
        if (!isActive) return;
        if (Array.isArray(liveMatches) && liveMatches.length > 0) {
          setMatches(liveMatches);
          setUsingFallbackData(false);
        } else {
          // API respondeu, mas sem jogos futuros cadastrados agora — mantém o fallback.
          setUsingFallbackData(true);
        }
      })
      .catch(() => {
        if (!isActive) return;
        // Falha ao buscar (ex: chave não configurada em ambiente local) — mantém o fallback.
        setUsingFallbackData(true);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, selectedMatch, selectedClub, selectedPlayer]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveTab('home'); setSelectedMatch(null); setSelectedClub(null); setSelectedPlayer(null); }}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
                FUT<span className="text-emerald-400">BRASIL</span> 24H
              </h1>
              <p className="text-[11px] text-slate-400 uppercase tracking-widest font-medium">Tabela & Horários</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <button 
              onClick={() => { setActiveTab('home'); setSelectedMatch(null); }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'home' && !selectedMatch ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-300 hover:bg-slate-800/60'}`}
            >
              <Activity className="w-4 h-4 text-emerald-400" /> Jogos do Brasileirão
            </button>
            <button 
              onClick={() => { setActiveTab('clubs'); setSelectedClub(null); }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'clubs' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-300 hover:bg-slate-800/60'}`}
            >
              <Shield className="w-4 h-4 text-emerald-400" /> Clubes Brasileiros
            </button>
            <button 
              onClick={() => { setActiveTab('players'); setSelectedPlayer(null); }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'players' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-300 hover:bg-slate-800/60'}`}
            >
              <Award className="w-4 h-4 text-emerald-400" /> Lendas & Jogadores
            </button>
          </nav>

          <div className="flex md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-300 hover:bg-slate-800 rounded-xl">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-2">
            <button 
              onClick={() => { setActiveTab('home'); setSelectedMatch(null); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center gap-3 text-slate-200"
            >
              <Activity className="w-5 h-5 text-emerald-400" /> Jogos do Brasileirão
            </button>
            <button 
              onClick={() => { setActiveTab('clubs'); setSelectedClub(null); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center gap-3 text-slate-200"
            >
              <Shield className="w-5 h-5 text-emerald-400" /> Clubes Brasileiros
            </button>
            <button 
              onClick={() => { setActiveTab('players'); setSelectedPlayer(null); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center gap-3 text-slate-200"
            >
              <Award className="w-5 h-5 text-emerald-400" /> Lendas & Jogadores
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        <AdPlaceholder slotTitle="Banner superior" format="horizontal" />

        {/* HOME VIEW: Match Center & Verified Schedule */}
        {activeTab === 'home' && !selectedMatch && (
          <div className="space-y-8">
            
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900/90 via-slate-900 to-slate-950 border border-indigo-500/20 p-8 md:p-12 shadow-2xl">
              <div className="max-w-2xl relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Campeonato Brasileiro Série A • 27ª rodada
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Acompanhe datas, horários e onde assistir a cada confronto
                </h2>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  Dados conferidos manualmente em fontes noticiosas em 12/09/2026. Confirme sempre horários e
                  transmissão no canal oficial antes do jogo, pois emissoras podem alterar a programação.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button 
                    onClick={() => setActiveTab('clubs')}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
                  >
                    Ver História dos Clubes <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-6 h-6 text-amber-500" />
                  <h3 className="text-xl font-bold text-white tracking-wide">Jogos Agendados da Rodada</h3>
                </div>
              </div>

              {usingFallbackData && (
                <div className="flex items-start gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Não foi possível buscar os jogos em tempo real agora. Mostrando a última lista conferida
                    manualmente — os horários podem estar desatualizados.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matches.map((match) => (
                  <div 
                    key={match.id}
                    onClick={() => setSelectedMatch(match)}
                    className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all shadow-xl cursor-pointer group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                      <span className="font-medium text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                        {match.competition}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                          <Calendar className="w-3 h-3 text-emerald-400" /> {match.date} às {match.time}
                        </span>
                        <span className="text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 font-bold">
                          {match.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 my-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={match.homeLogo} alt={match.homeTeam} className="w-8 h-8 object-contain drop-shadow" />
                          <span className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">{match.homeTeam}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-500 px-3 py-1 bg-slate-950 rounded-lg border border-slate-800">VS</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={match.awayLogo} alt={match.awayTeam} className="w-8 h-8 object-contain drop-shadow" />
                          <span className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">{match.awayTeam}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-500 px-3 py-1 bg-slate-950 rounded-lg border border-slate-800">VS</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                      <span className="truncate">📍 {match.stadium}</span>
                      <div className="flex items-center gap-1.5 text-emerald-300 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                        <Tv className="w-3.5 h-3.5" /> Onde assistir: {match.channel}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <AdPlaceholder slotTitle="Anúncio em feed" format="horizontal" />

          </div>
        )}

        {/* MATCH DETAILS VIEW */}
        {selectedMatch && (
          <div className="space-y-8 animate-fadeIn">
            <button 
              onClick={() => setSelectedMatch(null)}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-medium text-sm transition-all flex items-center gap-2"
            >
              ← Voltar para Todos os Jogos
            </button>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="text-center space-y-2 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                  {selectedMatch.competition}
                </span>
                <p className="text-xs text-slate-400">📅 {selectedMatch.date} às {selectedMatch.time} • 📍 {selectedMatch.stadium}</p>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mt-2">
                  <Tv className="w-3.5 h-3.5" /> Transmissão: <span className="text-white underline">{selectedMatch.channel}</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-6 border-y border-slate-800">
                <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3 w-full md:w-1/3">
                  <img src={selectedMatch.homeLogo} alt={selectedMatch.homeTeam} className="w-16 h-16 object-contain drop-shadow-md" />
                  <h2 className="text-2xl font-black text-white">{selectedMatch.homeTeam}</h2>
                  <span className="text-xs text-slate-400">Mandante</span>
                </div>

                <div className="flex flex-col items-center justify-center gap-2 px-6">
                  <div className="text-2xl md:text-4xl font-black tracking-widest text-slate-400">
                    AGENDADO
                  </div>
                  <span className="text-xs uppercase font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    {selectedMatch.date} - {selectedMatch.time}
                  </span>
                </div>

                <div className="flex flex-col items-center md:items-end text-center md:text-right gap-3 w-full md:w-1/3">
                  <img src={selectedMatch.awayLogo} alt={selectedMatch.awayTeam} className="w-16 h-16 object-contain drop-shadow-md" />
                  <h2 className="text-2xl font-black text-white">{selectedMatch.awayTeam}</h2>
                  <span className="text-xs text-slate-400">Visitante</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-400" /> Informações da Partida
                  </h4>
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">{selectedMatch.time}</span>
                      <div>
                        <p className="text-sm font-semibold text-white">📅 Partida da 27ª rodada do Brasileirão</p>
                        <p className="text-xs text-slate-400">Assista ao vivo na data informada através da emissora/plataforma: {selectedMatch.channel}. Confirme no canal oficial antes do jogo.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <AdPlaceholder slotTitle="Anúncio lateral" format="rectangle" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CLUBS VIEW */}
        {activeTab === 'clubs' && !selectedClub && (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                <Shield className="w-4 h-4" /> Maiores Clubes do Futebol Brasileiro
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">História dos Clubes Brasileiros</h2>
              <p className="text-slate-400 text-sm max-w-2xl">
                Explore a fundação, conquistas e tradição dos principais clubes do cenário nacional.
              </p>
            </div>

            <div className="relative max-w-md">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Pesquisar clube (ex: Flamengo, Palmeiras, Santos)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CLUBS_DATA
                .filter(club => club.name.toLowerCase().includes(searchQuery.toLowerCase()) || club.state.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((club) => (
                  <div 
                    key={club.id}
                    onClick={() => setSelectedClub(club)}
                    className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all shadow-xl cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <img src={club.logo} alt={club.name} className="w-12 h-12 object-contain drop-shadow group-hover:scale-110 transition-transform" />
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{club.name}</h3>
                          <span className="text-xs text-slate-400">Fundado em {club.founded}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{club.history}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span>📍 {club.state}</span>
                      <span className="text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        História Completa <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        )}

        {/* CLUB DETAILS VIEW */}
        {selectedClub && (
          <div className="space-y-8 animate-fadeIn">
            <button 
              onClick={() => setSelectedClub(null)}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-medium text-sm transition-all flex items-center gap-2"
            >
              ← Voltar para Lista de Clubes
            </button>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
                <div className="flex items-center gap-4">
                  <img src={selectedClub.logo} alt={selectedClub.name} className="w-20 h-20 object-contain drop-shadow-lg" />
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      📍 {selectedClub.state} • Fundado em {selectedClub.founded}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-white">{selectedClub.name}</h2>
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-center">
                  <span className="text-xs text-slate-500 uppercase tracking-wider block">Estádio Oficial</span>
                  <span className="text-lg font-bold text-white">{selectedClub.stadium}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6 text-slate-300 text-base leading-relaxed">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" /> Trajetória e Conquistas
                  </h3>
                  <p>{selectedClub.history}</p>
                  
                  <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 my-6">
                    <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-400" /> Principais Títulos
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {selectedClub.highlights.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <AdPlaceholder slotTitle="Anúncio no artigo" format="rectangle" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PLAYERS VIEW */}
        {activeTab === 'players' && !selectedPlayer && (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Award className="w-4 h-4" /> Galeria de Craques Inesquecíveis
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Lendas do Futebol Brasileiro</h2>
              <p className="text-slate-400 text-sm max-w-2xl">
                Relembre a biografia dos craques que construíram a reputação do Brasil como o país do futebol.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLAYERS_DATA.map((player) => (
                <div 
                  key={player.id}
                  onClick={() => setSelectedPlayer(player)}
                  className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all shadow-xl cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">{player.name}</h3>
                      <span className="text-xs font-semibold text-amber-400 block mt-1">{player.nickname}</span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{player.bio}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>Era: {player.era}</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Biografia Completa <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PLAYER DETAILS VIEW */}
        {selectedPlayer && (
          <div className="space-y-8 animate-fadeIn">
            <button 
              onClick={() => setSelectedPlayer(null)}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-medium text-sm transition-all flex items-center gap-2"
            >
              ← Voltar para Lendas
            </button>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    ⭐ {selectedPlayer.nickname} • {selectedPlayer.era}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black text-white">{selectedPlayer.name}</h2>
                  <p className="text-sm text-slate-400">Clubes e Seleção: {selectedPlayer.teams}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6 text-slate-300 text-base leading-relaxed">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-400" /> História e Legado
                  </h3>
                  <p>{selectedPlayer.bio}</p>
                  
                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                    <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                      📊 Números da Carreira
                    </h4>
                    <p className="text-sm text-emerald-300 font-medium">{selectedPlayer.stats}</p>
                  </div>
                </div>

                <div>
                  <AdPlaceholder slotTitle="Anúncio na biografia" format="rectangle" />
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-16 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
              ⚽
            </div>
            <div>
              <span className="font-bold text-white">FUTBRASIL 24H</span>
              <p className="text-xs text-slate-500">Dados conferidos manualmente — ver comentário no topo do arquivo</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} FutBrasil 24h. Todos os direitos reservados.
          </p>
        </div>
      </footer>

    </div>
  );
}
