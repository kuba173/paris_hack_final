import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "@/hooks/use-toast";
import { useAccount } from 'wagmi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const clubLogos: Record<string, string> = {
  "Arsenal": "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png",
  "Barcelona": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjjEff5OUSLgsahBGM46yHJ7ZY9TaXoVhrUA&s",
  "Manchester City": "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png",
  "Real Madrid": "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png",
  "Bayern Munich": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/FC_Bayern_M%C3%BCnchen_logo_%282024%29.svg/1200px-FC_Bayern_M%C3%BCnchen_logo_%282024%29.svg.png",
  "PSG": "https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Paris_Saint-Germain_F.C..svg/1200px-Paris_Saint-Germain_F.C..svg.png",
  "Liverpool": "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/1200px-Liverpool_FC.svg.png",
  "Borussia Dortmund": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Borussia_Dortmund_logo.svg/1200px-Borussia_Dortmund_logo.svg.png",
  "Inter Milan": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/1200px-FC_Internazionale_Milano_2021.svg.png",
  "Tottenham Hotspur": "https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Tottenham_Hotspur.svg/1200px-Tottenham_Hotspur.svg.png",
  "Ajax Amsterdam": "https://upload.wikimedia.org/wikipedia/en/thumb/7/79/Ajax_Amsterdam.svg/1200px-Ajax_Amsterdam.svg.png"
};

interface Auction {
  matchId: number;
}

const Developer = () => {
  const { isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [lastMatchId, setLastMatchId] = useState<number>(0);
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    matchDate: '',
  });

  // Pobierz ostatnie ID meczu przy ładowaniu komponentu
  React.useEffect(() => {
    fetch('http://localhost:8090/auctions')
      .then(res => res.json())
      .then((data: Auction[]) => {
        const maxMatchId = data.reduce((max: number, auction) => 
          Math.max(max, auction.matchId), 0);
        setLastMatchId(maxMatchId);
      })
      .catch(error => {
        console.error('Failed to fetch auctions:', error);
        setLastMatchId(0);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeamSelect = (value: string, field: 'team1' | 'team2') => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: "Not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (formData.team1 === formData.team2) {
      toast({
        title: "Invalid Teams",
        description: "Please select different teams",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const newMatchId = lastMatchId + 1;
      
      // Oblicz czas trwania aukcji (do momentu rozpoczęcia meczu)
      const matchDateTime = new Date(formData.matchDate);
      matchDateTime.setHours(23, 59, 59); // Set to end of the day
      const now = new Date();
      const durationInSeconds = Math.floor((matchDateTime.getTime() - now.getTime()) / 1000);
      
      if (durationInSeconds <= 0) {
        throw new Error('Match date must be in the future');
      }

      // Utwórz aukcję dla pierwszej drużyny
      const response1 = await fetch('http://localhost:8090/create-auction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId: newMatchId,
          team: formData.team1,
          durationInSeconds: durationInSeconds
        })
      });

      const data1 = await response1.json();
      if (!response1.ok) {
        throw new Error(data1.detail || 'Failed to create auction for team 1');
      }

      // Poczekaj na potwierdzenie pierwszej transakcji
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Utwórz aukcję dla drugiej drużyny z następnym nonce
      const nextNonce = data1.nonce + 1;
      console.log('Using nonce for second auction:', nextNonce);

      const response2 = await fetch('http://localhost:8090/create-auction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId: newMatchId,
          team: formData.team2,
          durationInSeconds: durationInSeconds,
          nonce: nextNonce // Przekaż następny nonce
        })
      });

      const data2 = await response2.json();
      if (!response2.ok) {
        // W przypadku błędu z drugą aukcją, pokaż więcej szczegółów
        console.error('Team 2 auction error:', data2);
        throw new Error(data2.detail || 'Failed to create auction for team 2');
      }
      
      toast({
        title: "Auctions Created Successfully",
        description: `Created auctions for ${formData.team1} vs ${formData.team2}`,
      });

      // Reset form
      setFormData({
        team1: '',
        team2: '',
        matchDate: '',
      });

      // Aktualizuj ostatnie ID
      setLastMatchId(newMatchId);

    } catch (error) {
      console.error('Create auction error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create auction",
        variant: "destructive",
      });

      // W przypadku błędu, spróbuj odświeżyć listę aukcji
      try {
        const response = await fetch('http://localhost:8090/auctions');
        const data = await response.json();
        const maxMatchId = data.reduce((max: number, auction: Auction) => 
          Math.max(max, auction.matchId), 0);
        setLastMatchId(maxMatchId);
      } catch (refreshError) {
        console.error('Failed to refresh auctions:', refreshError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Developer Panel
        </h1>
        <p className="text-xl text-gray-300">
          Create and manage auctions for match collectibles
        </p>
        <p className="mt-2 text-sm text-yellow-500 font-medium">
          Note: This functionality is restricted to developers only
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Auction</CardTitle>
            <CardDescription>Create a new auction for a match collectible</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAuction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team1">Team 1</Label>
                <Select value={formData.team1} onValueChange={(value) => handleTeamSelect(value, 'team1')}>
                  <SelectTrigger className="bg-gray-900/50 border-gray-700">
                    <SelectValue placeholder="Select first team" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(clubLogos).map((team) => (
                      <SelectItem key={team} value={team}>
                        <div className="flex items-center gap-2">
                          <img src={clubLogos[team]} alt={team} className="w-6 h-6 rounded-full" />
                          <span>{team}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="team2">Team 2</Label>
                <Select value={formData.team2} onValueChange={(value) => handleTeamSelect(value, 'team2')}>
                  <SelectTrigger className="bg-gray-900/50 border-gray-700">
                    <SelectValue placeholder="Select second team" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(clubLogos).map((team) => (
                      <SelectItem key={team} value={team} disabled={team === formData.team1}>
                        <div className="flex items-center gap-2">
                          <img src={clubLogos[team]} alt={team} className="w-6 h-6 rounded-full" />
                          <span>{team}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="matchDate">Match Date</Label>
                <Input
                  id="matchDate"
                  name="matchDate"
                  type="date"
                  value={formData.matchDate}
                  onChange={handleInputChange}
                  className="bg-gray-900/50 border-gray-700"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <Button 
                type="submit"
                disabled={loading || !isConnected || !formData.team1 || !formData.team2 || !formData.matchDate}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                {loading ? "Creating..." : "Create Auction"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Developer;
