import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, TrendingUp } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useAccount } from 'wagmi';
import { useBalanceRefetch } from '../contexts/BalanceRefetchContext';
import { ethers } from "ethers";

type AuctionApi = {
  auctionId: number;
  matchId: number;
  team: string;
  endTime: number;
  highestBidder: string;
  highestStake: number;
  finalized: boolean;
  stakers: { user: string; amount: number }[];
};

const CONTRACT_ADDRESS = "0x9284946D013baDa6ED25bDeb6F6b134AF348DB51";
const ABI = [
    {
        "inputs": [
            {"internalType": "uint256", "name": "matchId", "type": "uint256"},
            {"internalType": "string", "name": "team", "type": "string"},
            {"internalType": "uint256", "name": "durationInSeconds", "type": "uint256"}
        ],
        "name": "createAuction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "auctionId", "type": "uint256"}],
        "name": "stake",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "auctionId", "type": "uint256"}],
        "name": "finalizeAuction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getFullAuctionData",
        "outputs": [
            {
                "components": [
                    {"internalType": "uint256", "name": "auctionId", "type": "uint256"},
                    {"internalType": "uint256", "name": "matchId", "type": "uint256"},
                    {"internalType": "string", "name": "team", "type": "string"},
                    {"internalType": "uint256", "name": "endTime", "type": "uint256"},
                    {"internalType": "address", "name": "highestBidder", "type": "address"},
                    {"internalType": "uint256", "name": "highestStake", "type": "uint256"},
                    {"internalType": "bool", "name": "finalized", "type": "bool"},
                    {
                        "components": [
                            {"internalType": "address", "name": "user", "type": "address"},
                            {"internalType": "uint256", "name": "amount", "type": "uint256"}
                        ],
                        "internalType": "struct MatchTokenAuction.StakeInfo[]",
                        "name": "stakers",
                        "type": "tuple[]"
                    }
                ],
                "internalType": "struct MatchTokenAuction.AuctionFull[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const Auctions = () => {
  const [auctions, setAuctions] = useState<AuctionApi[]>([]);
  const [loadingAuctions, setLoadingAuctions] = useState(false);
  const { address, isConnected } = useAccount();
  const [stakeAmounts, setStakeAmounts] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});
  const [userStakes, setUserStakes] = useState<{[key: string]: number}>({});
  const refetchBalance = useBalanceRefetch();

  // Dodaj stan na aktualny czas
  const [now, setNow] = useState(Date.now());

  // Ustaw interval do aktualizacji czasu co sekundę
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 1. Wyciągnij fetchAuctions na zewnątrz useEffect
  const fetchAuctions = async () => {
    setLoadingAuctions(true);
    try {
      const res = await fetch("http://localhost:8090/auctions");
      const data: AuctionApi[] = await res.json();
      setAuctions(data.filter(a => a.auctionId >= 14));
    } catch {
      setAuctions([]);
    }
    setLoadingAuctions(false);
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const stakeChz = async (amount: number, matchId: string, team: string) => {
    try {
      // Znajdź auctionId dla danego matchId i team
      const auction = auctions.find(
        (a) => a.matchId.toString() === matchId && a.team === team
      );
      if (!auction) {
        toast({
          title: "Auction not found",
          description: "Could not find auction for this team.",
          variant: "destructive",
        });
        return false;
      }

      if (!window.ethereum) {
        toast({
          title: "Metamask not found",
          description: "Please install Metamask.",
          variant: "destructive",
        });
        return false;
      }

      // Połącz się z Metamask
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // Wywołaj stake
      const tx = await contract.stake(
        auction.auctionId,
        {
          value: ethers.parseEther(amount.toString())
        }
      );
      toast({
        title: "Stake sent!",
        description: "Your stake transaction has been sent to the blockchain.",
      });

      await tx.wait();

      toast({
        title: "Stake confirmed!",
        description: "Your stake has been confirmed on the blockchain.",
      });

      return true;
    } catch (e) {
      toast({
        title: "Stake failed",
        description: (e as Error).message,
        variant: "destructive",
      });
      return false;
    }
  };

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

  // Zmień funkcję getTimeRemaining, by korzystała z now
  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const difference = end - now;

    if (difference <= 0) return "00:00:00";

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const groupedAuctions = React.useMemo(() => {
    const map: Record<number, AuctionApi[]> = {};
    auctions.forEach(a => {
      if (!map[a.matchId]) map[a.matchId] = [];
      map[a.matchId].push(a);
    });
    return Object.values(map).filter(pair => pair.length === 2);
  }, [auctions]);

  const handleStake = async (matchId: string, team: string) => {
    const amount = parseFloat(stakeAmounts[`${matchId}-${team}`] || '0');
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid stake amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(prev => ({ ...prev, [`${matchId}-${team}`]: true }));

    const success = await stakeChz(amount, matchId, team);

    if (success) {
      setStakeAmounts(prev => ({ ...prev, [`${matchId}-${team}`]: '' }));
      setUserStakes(prev => ({
        ...prev,
        [`${matchId}-${team}`]: (prev[`${matchId}-${team}`] || 0) + amount
      }));
      toast({
        title: "Stake Successful!",
        description: `You staked ${amount} CHZ for ${team}. Total staked: ${(userStakes[`${matchId}-${team}`] || 0) + amount} CHZ`,
      });
      // Dodaj opóźnienie przed odświeżeniem
      setTimeout(() => {
        fetchAuctions();
        refetchBalance(); // <-- odśwież saldo w Layout!
      }, 3000); // 3 sekundy
    } else {
      fetchAuctions();
      refetchBalance();
    }
    setLoading(prev => ({ ...prev, [`${matchId}-${team}`]: false }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Live Auctions
        </h1>
        <p className="text-xl text-gray-300">
          Stake CHZ tokens to win exclusive TokenTale. Boost your chances by using team's Fan Tokens as stake multipliers! The highest staker wins when the auction ends!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loadingAuctions ? (
          <div className="text-center col-span-3 text-yellow-400 text-xl">Loading auctions...</div>
        ) : groupedAuctions.length === 0 ? (
          <div className="text-center col-span-3 text-red-400 text-xl">No active auctions</div>
        ) : (
          groupedAuctions.map((pair) => {
            const [a1, a2] = pair;
            const minEndTime = Math.min(a1.endTime, a2.endTime);
            return (
              <Card key={a1.matchId} className="relative overflow-hidden">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-pink-900/40 animate-gradient-slow" />
                
                {/* Card content with glassmorphism effect */}
                <CardContent className="relative p-6 lg:p-2 backdrop-blur-sm">
                  {/* Timer section with improved design */}
                  <div className="flex flex-col items-center mb-8">
                    <div className="bg-black/30 p-4 rounded-xl border border-green-500/30 backdrop-blur-md">
                      <span className="block uppercase text-gray-300 text-sm tracking-widest font-medium mb-2 text-center">
                        Auction ends in
                      </span>
                      <span className="block text-4xl md:text-5xl font-extrabold text-green-400 tabular-nums">
                        {getTimeRemaining(new Date(minEndTime * 1000).toISOString())}
                      </span>
                    </div>
                  </div>

                  {/* Teams container */}
                  <div className="relative grid grid-cols-2 gap-2 mb-6 mx-auto w-[100%]">
                    {[a1, a2].map((a, idx) => {
                      const isWinning = isConnected &&
                        a.highestBidder?.toLowerCase() === (address || '').toLowerCase() &&
                        a.highestStake > 0;

                      return (
                        <div
                          key={a.team}
                          className={`relative p-3 rounded-xl transition-all duration-300
                            ${isWinning 
                              ? "bg-gradient-to-b from-green-900/40 to-green-800/20 border-2 border-green-400/50 shadow-lg shadow-green-400/20" 
                              : "bg-gradient-to-b from-gray-800/40 to-gray-900/20 border border-gray-700/50"}
                          `}
                        >
                          {/* Team header */}
                          <div className="flex flex-col items-center mb-4">
                            <div className="relative mb-2">
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-md opacity-50" />
                              <img
                                src={clubLogos[a.team] || ""}
                                alt={a.team}
                                className="relative w-14 h-14 rounded-full object-cover border-2 border-white/20 bg-white"
                              />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1 truncate max-w-[120px] text-center" title={a.team}>
                              {a.team}
                            </h3>
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[11px] text-gray-400">Second highest better</span>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-green-400" />
                                <span className="font-medium text-green-400 text-sm">{a.highestStake} CHZ</span>
                              </div>
                            </div>
                          </div>

                          {/* Winning badge */}
                          {isWinning && (
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-3 py-1 rounded-full text-sm shadow-lg transform rotate-12 border border-green-400/50">
                              Leading!
                            </div>
                          )}

                          {/* User stake info */}
                          <div className="bg-black/20 rounded-lg p-2 mb-3">
                            <div className="flex items-center justify-center gap-1 text-xs">
                              <Users className="w-3 h-3 text-blue-400" />
                              <span className="text-blue-400 font-medium truncate max-w-[100px]" title={
                                isConnected
                                  ? `Staked: ${a.stakers
                                      .filter(s => s.user.toLowerCase() === (address || '').toLowerCase())
                                      .reduce((sum, s) => sum + s.amount, 0)} CHZ`
                                  : 'Connect wallet'
                              }>
                                {isConnected
                                  ? `Staked: ${a.stakers
                                      .filter(s => s.user.toLowerCase() === (address || '').toLowerCase())
                                      .reduce((sum, s) => sum + s.amount, 0)} CHZ`
                                  : 'Connect wallet'}
                              </span>
                            </div>
                          </div>

                          {/* Stake controls */}
                          <div className="space-y-1.5">
                            <Input
                              type="number"
                              min={0}
                              placeholder="Amount in CHZ"
                              value={stakeAmounts[`${a.matchId}-${a.team}`] || ""}
                              onChange={e =>
                                setStakeAmounts(prev => ({
                                  ...prev,
                                  [`${a.matchId}-${a.team}`]: e.target.value,
                                }))
                              }
                              className="w-full bg-black/30 border-gray-700 focus:border-blue-500 transition-colors"
                            />
                            <Button
                              size="lg"
                              className={`w-full ${
                                a.endTime * 1000 < now
                                  ? "bg-gray-700 cursor-not-allowed"
                                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                              }`}
                              disabled={
                                !isConnected ||
                                loading[`${a.matchId}-${a.team}`] ||
                                a.endTime * 1000 < now
                              }
                              onClick={() => handleStake(a.matchId.toString(), a.team)}
                            >
                              {a.endTime * 1000 < now
                                ? "Auction ended"
                                : loading[`${a.matchId}-${a.team}`]
                                  ? "Staking..."
                                  : "Stake CHZ"}
                            </Button>
                            <Button
                              variant="outline"
                              size="lg"
                              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black border-none font-bold"
                              onClick={() => window.open("https://www.chiliz.com/#", "_blank")}
                            >
                              Buy CHZ
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Auctions;
