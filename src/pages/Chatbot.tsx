import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, Copy } from 'lucide-react'; // Dodaj import ikony

type Token = {
  id: string;
  team: string;
  opponent: string;
  date: string;
  result: string;
  rarity: string;
};

const Chatbot = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{type: 'user' | 'bot', content: string, tokens?: Token[]}>>([
    {
      type: 'bot',
      content: 'Hello! I can help you search through match collectibles. Try asking me something like "Find tokens where Messi scored" or "Show me all Barcelona victories".'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  const mockSearchResults = [
    {
      id: '1',
      team: 'Arsenal',
      opponent: 'Chelsea',
      date: '2024-05-20T19:00:00Z',
      result: '2-1',
      rarity: 'Rare',
    },
    {
      id: '2',
      team: 'Barcelona',
      opponent: 'Real Madrid',
      date: '2024-05-15T21:00:00Z',
      result: '1-0',
      rarity: 'Legendary',
    }
  ];

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMessage = { type: 'user' as const, content: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock response based on query
    let response = '';
    let tokens: Token[] = [];

    if (query.toLowerCase().includes('saka') || query.toLowerCase().includes('arsenal')) {
      response = 'I found 1 collectible featuring Bukayo Saka:';
      tokens = [mockSearchResults[0]];
    } else if (query.toLowerCase().includes('barcelona') || query.toLowerCase().includes('lewandowski')) {
      response = 'I found 1 Barcelona collectible with Lewandowski:';
      tokens = [mockSearchResults[1]];
    } else if (query.toLowerCase().includes('legendary') || query.toLowerCase().includes('rare')) {
      response = 'Here are the rare and legendary collectibles I found:';
      tokens = mockSearchResults;
    } else {
      response = 'I found 2 collectibles matching your search:';
      tokens = mockSearchResults;
    }

    const botMessage = { type: 'bot' as const, content: response, tokens };
    setMessages(prev => [...prev, botMessage]);
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
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

  const suggestedQueries = [
    "Find tokens where Arsenal won",
    "Show me legendary collectibles",
    "Find matches with Lewandowski",
    "Show Barcelona vs Real Madrid tokens"
  ];

  const handleCopy = (address: string, tokenId: string) => {
    navigator.clipboard.writeText(address);
    setCopiedTokenId(tokenId);
    setTimeout(() => setCopiedTokenId(null), 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          AI Collectible Search
        </h1>
        <p className="text-xl text-gray-600">
          Search through match collectibles using natural language. Ask about players, teams, results, or any match details!
        </p>
      </div>

      <div className="space-y-6">
        {/* Chat Messages */}
        <Card className="h-96 overflow-y-auto">
          <CardContent className="p-6">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    
                    {message.tokens && message.tokens.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {message.tokens.map((token) => {
                          // Pełny adres właściciela
                          const ownerAddress = "0x1234567890abcdef1234567890abcdef1234abcd";
                          // Skrócona wersja do wyświetlania
                          const shortAddress = ownerAddress.slice(0, 6) + "..." + ownerAddress.slice(-4);
                          return (
                            <div
                              key={token.id}
                              className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 text-gray-100 rounded-lg p-4 shadow-md flex flex-col items-center"
                            >
                              <img
                                src={
                                  {
                                    'Arsenal': 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png',
                                    'Barcelona': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjjEff5OUSLgsahBGM46yHJ7ZY9TaXoVhrUA&s',
                                    'Real Madrid': 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png',
                                    'Chelsea': 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/1200px-Chelsea_FC.svg.png',
                                  }[token.team] || `https://source.unsplash.com/seed/${token.team}/100x100`
                                }
                                alt={`${token.team} logo`}
                                className="w-16 h-16 rounded-full object-cover border-4 border-yellow-400 mb-2"
                              />
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-base font-bold text-yellow-300">{token.team}</span>
                                <span className="text-base text-gray-400">vs</span>
                                <span className="text-base font-bold text-blue-300">{token.opponent}</span>
                              </div>
                              <div className="text-lg font-bold text-yellow-400 mb-1">
                                Result: {token.result}
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="flex items-center text-xs text-gray-400">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(token.date)}
                                </span>
                              </div>
                              <div className="w-full flex flex-col gap-1 text-xs text-gray-400 mb-1">
                                <div>
                                  <span className="font-semibold">Token name:</span> {token.team} Match Collectible
                                </div>
                                <div>
                                  <span className="font-semibold">Token ID:</span> {token.id}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">Owner:</span> {shortAddress}
                                  <button
                                    className="ml-1 p-1 rounded hover:bg-gray-700 transition"
                                    title="Copy address"
                                    onClick={() => handleCopy(ownerAddress, token.id)}
                                  >
                                    <Copy className="h-4 w-4 text-gray-400" />
                                  </button>
                                  {copiedTokenId === token.id && (
                                    <span className="text-green-400 ml-1">Copied!</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                    <p className="text-sm">Searching collectibles...</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Input Area */}
        <Card>
          <CardContent className="p-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Ask me about any collectible... (e.g., 'Find tokens where Messi scored')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={loading}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={loading || !query.trim()}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Suggested Queries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Try these examples:</CardTitle>
            <CardDescription>
              Click on any suggestion to search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedQueries.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left h-auto p-3"
                  onClick={() => setQuery(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chatbot;
