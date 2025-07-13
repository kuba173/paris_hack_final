import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import { useWeb3 } from '@/contexts/Web3Context';
import { Calendar, Search } from 'lucide-react';
import { useAccount } from 'wagmi';

const MyTokens = () => {
  // const { isConnected } = useWeb3();
  const { address, isConnected } = useAccount();
  const mockTokens = [
    {
      id: '1',
      matchId: 'match-001',
      team: 'Arsenal',
      opponent: 'Chelsea',
      date: '2024-05-20T19:00:00Z',
      result: '2-1',
      stakeAmount: 250,
      rarity: 'Rare',
      metadata: {
        summary: 'Arsenal secured a hard-fought 2-1 victory over Chelsea in a tightly contested London derby. Gabriel opened the scoring in the first half with a well-timed header from a corner. Chelsea responded with intensity but were repeatedly denied by Arsenal’s solid defense. Bukayo Saka doubled the lead midway through the second half with a composed finish after a smooth build-up. Despite conceding a late goal, Arsenal held on to claim all three points and maintain their momentum.'
      }
    },
    {
      id: '2',
      matchId: 'match-002',
      team: 'Manchester City',
      opponent: 'Liverpool',
      date: '2024-05-18T16:30:00Z',
      result: '3-2',
      stakeAmount: 180,
      rarity: 'Epic',
      metadata: {
        summary: 'Manchester City triumphed 3-2 over Liverpool in a high-octane clash at the Etihad Stadium. Erling Haaland scored twice, showcasing his striking instincts with clinical finishes. Kevin De Bruyne also added a goal, dominating the midfield alongside Bernardo Silva. Liverpool pushed back with two well-taken goals, but City’s attacking depth proved decisive. The match was a showcase of elite Premier League talent and thrilling end-to-end football.'
      }
    },
    {
      id: '3',
      matchId: 'match-003',
      team: 'Barcelona',
      opponent: 'Real Madrid',
      date: '2024-05-15T21:00:00Z',
      result: '0-1',
      stakeAmount: 320,
      rarity: 'Legendary',
      metadata: {
        summary: 'Barcelona suffered a narrow 0-1 defeat to arch-rivals Real Madrid in a tense El Clasico clash. Despite dominating possession for long periods, they struggled to break down Madrid’s compact defense. Real Madrid struck late with a swift counter-attack, catching Barcelona off guard. The home crowd was silenced as the visitors celebrated a decisive blow in the title race. Barcelona will look to regroup and bounce back in the next fixture.'
      }
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common':
        return 'bg-gray-100 text-gray-800';
      case 'Rare':
        return 'bg-blue-100 text-blue-800';
      case 'Epic':
        return 'bg-purple-100 text-purple-800';
      case 'Legendary':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Mapowanie nazw drużyn na URL logo
  const teamLogos: Record<string, string> = {
    'Arsenal': 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png',
    'Barcelona': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjjEff5OUSLgsahBGM46yHJ7ZY9TaXoVhrUA&s',
    'Manchester City': 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png',
    'Real Madrid': 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png',
    'Bayern Munich': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/FC_Bayern_M%C3%BCnchen_logo_%282024%29.svg/1200px-FC_Bayern_M%C3%BCnchen_logo_%282024%29.svg.png',
    'PSG': 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Paris_Saint-Germain_F.C..svg/1200px-Paris_Saint-Germain_F.C..svg.png',
    'Chelsea': 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/1200px-Chelsea_FC.svg.png',
    'Liverpool': 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
  };

  // State to track which summary is expanded
  const [expanded, setExpanded] = useState<string | null>(null);
  // Dodajemy state dla ukrytej zawartości
  const [hiddenContent, setHiddenContent] = useState<string | null>(null);

  // Filtry
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [result, setResult] = useState<'all' | 'win' | 'draw' | 'lose'>('all');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');

  // Unikalne lata do selecta
  const years = Array.from(new Set(mockTokens.map(t => new Date(t.date).getFullYear().toString())));

  // Filtrowanie
  let filteredTokens = mockTokens.filter(token => {
    // Szukanie po nazwie drużyny lub przeciwnika
    const searchMatch =
      token.team.toLowerCase().includes(search.toLowerCase()) ||
      token.opponent.toLowerCase().includes(search.toLowerCase());

    // Filtrowanie po dacie (rok)
    const dateMatch = date
      ? new Date(token.date).getFullYear().toString() === date
      : true;

    // Filtrowanie po wyniku
    let resultMatch = true;
    if (result !== 'all') {
      const [teamGoals, opponentGoals] = token.result.split('-').map(Number);
      if (result === 'win') resultMatch = teamGoals > opponentGoals;
      if (result === 'lose') resultMatch = teamGoals < opponentGoals;
      if (result === 'draw') resultMatch = teamGoals === opponentGoals;
    }

    return searchMatch && dateMatch && resultMatch;
  });

  // Sortowanie po dacie
  filteredTokens = filteredTokens.sort((a, b) => {
    const aTime = new Date(a.date).getTime();
    const bTime = new Date(b.date).getTime();
    return sort === 'asc' ? aTime - bTime : bTime - aTime;
  });

  // Funkcja do określania wyniku dla teamu
  const getTeamMatchResult = (token: typeof mockTokens[0]) => {
    const [teamGoals, opponentGoals] = token.result.split('-').map(Number);
    if (teamGoals > opponentGoals) return 'Win';
    if (teamGoals < opponentGoals) return 'Loss';
    return 'Draw';
  };

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            My Collectibles
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect your wallet to view your collectible tokens
          </p>
          <div className="bg-yellow-50 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-yellow-800">
              Please connect your wallet to access your collection
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          My Collectibles
        </h1>
        <p className="text-xl text-gray-600">
          Your collection of exclusive match day tokens with embedded match metadata
        </p>
      </div>

      {/* FILTRY */}
      <div className="flex flex-wrap gap-4 mb-8 items-end">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by team or opponent"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400 mr-2">Year:</label>
          <select
            value={date}
            onChange={e => setDate(e.target.value)}
            className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-700"
          >
            <option value="">All</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400 mr-2">Result:</label>
          <select
            value={result}
            onChange={e => setResult(e.target.value as 'all' | 'win' | 'draw' | 'lose')}
            className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-700"
          >
            <option value="all">All</option>
            <option value="win">Win</option>
            <option value="draw">Draw</option>
            <option value="lose">Lose</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400 mr-2">Sort by date:</label>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as 'asc' | 'desc')}
            className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-700"
          >
            <option value="desc">Newest</option>
            <option value="asc">Oldest</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTokens.map((token, idx) => {
          const isHidden = hiddenContent === token.id;
          const bgImage = `/art/moj${idx + 1}.png`;
          return (
            <Card
              key={token.id}
              className="relative overflow-hidden border border-gray-700 shadow-md h-full flex flex-col cursor-pointer"
              style={{
                backgroundImage: `url('${bgImage}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
              onClick={() => setHiddenContent(isHidden ? null : token.id)}
            >
              {!isHidden && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-gray-900/20 to-gray-800/20 z-0" />
                  <CardContent className="p-6 flex flex-col h-full relative z-10">
                    {/* WIN/DRAW/LOSS BADGE */}
                    <div
                      className={
                        "absolute top-4 right-4 px-3 py-1 rounded-full border-2 text-xs font-bold shadow z-20 " +
                        (getTeamMatchResult(token) === 'Win'
                          ? 'border-green-400 text-green-400 bg-green-900/30'
                          : getTeamMatchResult(token) === 'Draw'
                          ? 'border-yellow-400 text-yellow-400 bg-yellow-900/30'
                          : 'border-red-400 text-red-400 bg-red-900/30')
                      }
                    >
                      {getTeamMatchResult(token)}
                    </div>

                    {/* Team info and match */}
                    <div className="flex flex-col items-center mb-4">
                      <img
                        src={teamLogos[token.team] || `https://source.unsplash.com/seed/${token.team}/100x100`}
                        alt={`${token.team} logo`}
                        className="w-20 h-20 rounded-full object-cover border-4 border-yellow-400 mb-2 bg-white bg-opacity-80"
                      />
                      <span className="text-lg font-bold text-yellow-300">{token.team}</span>
                      <Badge className="mt-1 text-xs border-yellow-400 text-yellow-400 bg-gray-900">
                        Token ID: {token.id}
                      </Badge>
                    </div>

                    {/* Match info */}
                    <div className="text-center mb-2">
                      <div className="text-sm text-gray-300 mb-1">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        {formatDate(token.date)}
                      </div>
                      <div className="text-base font-semibold text-gray-100">
                        {token.team} vs {token.opponent}
                      </div>
                      <div className="text-lg font-bold text-yellow-300">
                        Result: {token.result}
                      </div>
                    </div>

                    {/* Staked CHZ */}
                    <div className="text-center mb-2">
                      <span className="text-sm text-gray-300">Staked:</span>
                      <span className="ml-2 text-base font-bold text-green-400">{token.stakeAmount} CHZ</span>
                    </div>

                    {/* Match summary */}
                    <div className="bg-gray-900/80 rounded-lg p-3 border border-gray-700 mb-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(expanded === token.id ? null : token.id);
                      }}
                      title={expanded === token.id ? "Click to collapse" : "Click to expand"}
                    >
                      <h4 className="font-semibold mb-1 text-gray-200 text-sm">Match Summary</h4>
                      <div
                        className={`text-sm text-gray-100 font-medium transition-all duration-200 ${
                          expanded === token.id ? '' : 'line-clamp-3'
                        }`}
                      >
                        {token.metadata.summary}
                      </div>
                      {expanded !== token.id && (
                        <div className="text-xs text-blue-400 mt-1">Show more</div>
                      )}
                      {expanded === token.id && (
                        <div className="text-xs text-blue-400 mt-1">Show less</div>
                      )}
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          );
        })}
      </div>

      {filteredTokens.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">
            You don't have any collectibles yet
          </p>
          <p className="text-gray-500">
            Participate in auctions to win exclusive match day tokens!
          </p>
        </div>
      )}
    </div>
  );
};

export default MyTokens;
