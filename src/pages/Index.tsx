import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar } from 'lucide-react';

const Index = () => {
  const upcomingMatches = [
    {
      id: '1',
      homeTeam: 'Arsenal',
      awayTeam: 'Barcelona',
      homeTeamLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png',
      awayTeamLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjjEff5OUSLgsahBGM46yHJ7ZY9TaXoVhrUA&s',
      date: '2024-05-25T19:00:00Z',
      stadium: 'Emirates Stadium',
      status: 'upcoming',
      auctionEnds: '2024-05-25T18:45:00Z'
    },
    {
      id: '2',
      homeTeam: 'Manchester City',
      awayTeam: 'Real Madrid',
      homeTeamLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png',
      awayTeamLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png',
      date: '2024-05-26T20:00:00Z',
      stadium: 'Etihad Stadium',
      status: 'upcoming',
      auctionEnds: '2024-05-26T19:45:00Z'
    },
    {
      id: '3',
      homeTeam: 'Bayern Munich',
      awayTeam: 'PSG',
      homeTeamLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/FC_Bayern_M%C3%BCnchen_logo_%282024%29.svg/1200px-FC_Bayern_M%C3%BCnchen_logo_%282024%29.svg.png',
      awayTeamLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Paris_Saint-Germain_F.C..svg/1200px-Paris_Saint-Germain_F.C..svg.png',
      date: '2024-05-27T19:30:00Z',
      stadium: 'Allianz Arena',
      status: 'upcoming',
      auctionEnds: '2024-05-27T19:15:00Z'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900">
      {/* Background with animated gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/art/obr1.png')] opacity-5 bg-cover bg-center mix-blend-overlay"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with enhanced styling */}
        <div className="text-center mb-12 pt-16">
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg blur opacity-25"></div>
            <h1 className="relative text-6xl font-extrabold mb-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Win Exclusive Match Collectibles
            </h1>
          </div>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-12 mt-8 leading-relaxed backdrop-blur-sm">
            Stake CHZ tokens to win unique digital collectibles for your favorite team. 
            Each match creates two exclusive tokens - one for each team. The highest staker wins!
          </p>
          <div className="flex justify-center space-x-6">
            <Link to="/auctions">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-green-500/20">
                View Live Auctions
              </Button>
            </Link>
            <Link to="/chatbot">
              <Button size="lg" variant="outline" className="border-2 border-gray-600 text-gray-200 hover:bg-gray-800/50 backdrop-blur-sm transform hover:scale-105 transition-all duration-200">
                Search Collectibles
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Section with glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center bg-gray-800/40 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/60 transition-all duration-200 transform hover:scale-105">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-400 mb-2">1,247</div>
              <div className="text-gray-300">Total Collectibles</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gray-800/40 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/60 transition-all duration-200 transform hover:scale-105">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-400 mb-2">45,892</div>
              <div className="text-gray-300">CHZ Staked</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gray-800/40 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/60 transition-all duration-200 transform hover:scale-105">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-400 mb-2">892</div>
              <div className="text-gray-300">Active Collectors</div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Matches */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Upcoming Matches</h2>
            <Link to="/auctions">
              <Button variant="outline" className="border-2 border-gray-600 text-gray-200 hover:bg-gray-800/50 backdrop-blur-sm">
                View All Auctions
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMatches.map((match) => (
              <Card key={match.id} className="relative overflow-hidden bg-gray-800/40 border-gray-700/50 backdrop-blur-sm flex flex-col hover:bg-gray-800/60 transition-all duration-200 transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-green-600/5"></div>
                <CardHeader className="flex-1 relative">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="bg-gradient-to-r from-green-600 to-green-500 text-white border-none shadow-lg shadow-green-500/20">
                      Auction Live
                    </Badge>
                    <div className="flex items-center text-sm text-gray-300 bg-black/20 px-3 py-1 rounded-full">
                      <Clock className="h-4 w-4 mr-1 text-green-400" />
                      Ends {formatDate(match.auctionEnds)}
                    </div>
                  </div>
                  <CardTitle className="text-gray-100">
                    <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-3">
                      <div className="flex items-center gap-2 justify-end min-w-0">
                        <img 
                          src={match.homeTeamLogo} 
                          alt={`${match.homeTeam} logo`}
                          className="w-8 h-8 shrink-0 rounded-full object-cover border border-gray-600"
                        />
                        <span className="font-bold truncate">{match.homeTeam}</span>
                      </div>
                      <span className="text-gray-400 text-center">vs</span>
                      <div className="flex items-center gap-2 justify-start min-w-0">
                        <span className="font-bold truncate">{match.awayTeam}</span>
                        <img 
                          src={match.awayTeamLogo} 
                          alt={`${match.awayTeam} logo`}
                          className="w-8 h-8 shrink-0 rounded-full object-cover border border-gray-600"
                        />
                      </div>
                    </div>
                  </CardTitle>
                  <CardDescription className="text-center mt-4">
                    <div className="flex items-center justify-center text-sm text-gray-300">
                      <Calendar className="h-4 w-4 mr-1 shrink-0" />
                      <span className="truncate">{formatDate(match.date)} • {match.stadium}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg backdrop-blur-sm hover:bg-blue-900/30 transition-colors">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <img 
                            src={match.homeTeamLogo} 
                            alt={`${match.homeTeam} logo`}
                            className="w-6 h-6 shrink-0 rounded-full object-cover"
                          />
                          <div className="font-semibold text-blue-300 truncate">{match.homeTeam}</div>
                        </div>
                        <div className="text-sm text-blue-400">Current: 150 CHZ</div>
                      </div>
                      <div className="text-center p-3 bg-red-900/20 border border-red-700/50 rounded-lg backdrop-blur-sm hover:bg-red-900/30 transition-colors">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <img 
                            src={match.awayTeamLogo} 
                            alt={`${match.awayTeam} logo`}
                            className="w-6 h-6 shrink-0 rounded-full object-cover"
                          />
                          <div className="font-semibold text-red-300 truncate">{match.awayTeam}</div>
                        </div>
                        <div className="text-sm text-red-400">Current: 200 CHZ</div>
                      </div>
                    </div>
                    <Link to={`/auctions?matchId=${match.id}`} className="block">
                      <Button className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 border-none transform hover:scale-105 transition-all duration-200">
                        Join Auction
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="relative bg-gray-800/40 border border-gray-700/50 rounded-2xl p-8 shadow-lg backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-green-600/5"></div>
          <div className="relative">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center transform hover:scale-105 transition-all duration-200">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="font-semibold mb-2 text-gray-200">Choose Match</h3>
                <p className="text-gray-400 text-sm">Select an upcoming match and pick your team</p>
              </div>
              <div className="text-center transform hover:scale-105 transition-all duration-200">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="font-semibold mb-2 text-gray-200">Stake CHZ</h3>
                <p className="text-gray-400 text-sm">Stake CHZ tokens to compete for the collectible</p>
              </div>
              <div className="text-center transform hover:scale-105 transition-all duration-200">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="font-semibold mb-2 text-gray-200">Match Starts</h3>
                <p className="text-gray-400 text-sm">Auction ends when the match begins</p>
              </div>
              <div className="text-center transform hover:scale-105 transition-all duration-200">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/20">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <h3 className="font-semibold mb-2 text-gray-200">Win Token</h3>
                <p className="text-gray-400 text-sm">Highest staker receives the unique collectible. Other participants get their CHZ back!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
