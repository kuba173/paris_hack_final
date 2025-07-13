import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Copy, Search } from 'lucide-react';

const marketplaceTokens = [
	{
		id: '101',
		matchId: 'match-101',
		team: 'Bayern Munich',
		opponent: 'PSG',
		date: '2020-06-10T20:00:00Z',
		result: '4-2',
		rarity: 'Epic',
		price: 350,
		owner: '0x1111222233334444555566667777888899990000',
		image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/FC_Bayern_M%C3%BCnchen_logo_%282024%29.svg/1200px-FC_Bayern_M%C3%BCnchen_logo_%282024%29.svg.png',
		metadata: {
			summary:
				'Bayern Munich delivered a stunning performance against PSG, scoring four goals in a thrilling Champions League encounter. Harry Kane opened the scoring early, with Musiala, Müller, and Sané adding to the tally. PSG fought back with two goals but couldn’t match Bayern’s attacking prowess.',
		},
	},
	{
		id: '102',
		matchId: 'match-102',
		team: 'Chelsea',
		opponent: 'Liverpool',
		date: '2023-06-12T18:30:00Z',
		result: '1-3',
		rarity: 'Rare',
		price: 210,
		owner: '0x2222333344445555666677778888999900001111',
		image: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/1200px-Chelsea_FC.svg.png',
		metadata: {
			summary:
				'Chelsea suffered a 1-3 defeat at home to Liverpool. Despite an early goal from Sterling, Liverpool’s relentless attack proved too much, with three unanswered goals sealing the win for the visitors.',
		},
	},
	{
		id: '103',
		matchId: 'match-103',
		team: 'Real Madrid',
		opponent: 'Manchester City',
		date: '2019-06-15T21:00:00Z',
		result: '2-2',
		rarity: 'Legendary',
		price: 470,
		owner: '0x3333444455556666777788889999000011112222',
		image: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png',
		metadata: {
			summary:
				'A dramatic 2-2 draw between Real Madrid and Manchester City kept fans on the edge of their seats. Bellingham and Vinicius Jr scored for Madrid, while City responded with two goals of their own in a match full of twists.',
		},
	},
	{
		id: '104',
		matchId: 'match-104',
		team: 'Juventus',
		opponent: 'Inter Milan',
		date: '2020-03-08T18:00:00Z',
		result: '2-0',
		rarity: 'Rare',
		price: 290,
		owner: '0x4444555566667777888899990000111122223333',
		image: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Juventus_FC_2017_logo.svg',
		metadata: {
			summary:
				'Juventus secured a solid 2-0 win over Inter Milan, with goals from Ronaldo and Dybala. The defense held strong, keeping a clean sheet in a crucial Serie A clash.',
		},
	},
	{
		id: '105',
		matchId: 'match-105',
		team: 'Barcelona',
		opponent: 'Atletico Madrid',
		date: '2019-11-23T21:00:00Z',
		result: '3-1',
		rarity: 'Epic',
		price: 380,
		owner: '0x5555666677778888999900001111222233334444',
		image: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
		metadata: {
			summary:
				'Barcelona dominated Atletico Madrid with a 3-1 victory. Messi, Suarez, and Griezmann all found the net in a memorable night at Camp Nou.',
		},
	},
	{
		id: '106',
		matchId: 'match-106',
		team: 'Arsenal',
		opponent: 'Tottenham',
		date: '2023-09-01T17:30:00Z',
		result: '2-2',
		rarity: 'Common',
		price: 120,
		owner: '0x6666777788889999000011112222333344445555',
		image: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
		metadata: {
			summary:
				'A thrilling North London derby ended in a 2-2 draw. Arsenal and Tottenham both showed attacking flair, sharing the points in a dramatic encounter.',
		},
	},
	{
		id: '107',
		matchId: 'match-107',
		team: 'Borussia Dortmund',
		opponent: 'Bayer Leverkusen',
		date: '2020-02-14T19:00:00Z',
		result: '5-2',
		rarity: 'Legendary',
		price: 500,
		owner: '0x7777888899990000111122223333444455556666',
		image: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg',
		metadata: {
			summary:
				'Borussia Dortmund put on an attacking masterclass against Bayer Leverkusen, scoring five goals. Haaland and Reus led the charge in a high-scoring Bundesliga match.',
		},
	},
	{
		id: '108',
		matchId: 'match-108',
		team: 'AC Milan',
		opponent: 'Napoli',
		date: '2019-10-05T20:45:00Z',
		result: '1-0',
		rarity: 'Rare',
		price: 230,
		owner: '0x8888999900001111222233334444555566667777',
		image: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg',
		metadata: {
			summary:
				'AC Milan edged Napoli 1-0 thanks to a second-half strike from Ibrahimovic. The Rossoneri defense held firm to secure all three points.',
		},
	},
];

const teamLogos: Record<string, string> = {
	'Bayern Munich':
		'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/FC_Bayern_M%C3%BCnchen_logo_%282024%29.svg/1200px-FC_Bayern_M%C3%BCnchen_logo_%282024%29.svg.png',
	PSG: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Paris_Saint-Germain_F.C..svg/1200px-Paris_Saint-Germain_F.C..svg.png',
	Chelsea: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/1200px-Chelsea_FC.svg.png',
	Liverpool: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
	'Real Madrid':
		'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png',
	'Manchester City':
		'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png',
	Juventus: 'https://creativereview.imgix.net/content/uploads/2017/01/170115_logoprimario_rgb.jpg?auto=compress,format&q=60&w=697&h=1080',
};

const Marketplace: React.FC = () => {
	const [bought, setBought] = useState<string[]>([]);
	const [expanded, setExpanded] = useState<string | null>(null);
	const [hiddenContent, setHiddenContent] = useState<string | null>(null);

	// Filtry
	const [search, setSearch] = useState('');
	const [date, setDate] = useState('');
	const [result, setResult] = useState<'all' | 'win' | 'draw' | 'lose'>('all');
	const [sort, setSort] = useState<'asc' | 'desc'>('desc');

	const handleBuy = (id: string) => setBought([...bought, id]);
	const handleCopy = async (address: string) => await navigator.clipboard.writeText(address);

	const formatDate = (dateString: string) =>
		new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

	// Filtrowanie
	let filteredTokens = marketplaceTokens.filter(token => {
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

	// Unikalne lata do selecta
	const years = Array.from(new Set(marketplaceTokens.map(t => new Date(t.date).getFullYear().toString())));

	// Funkcja do określania wyniku dla teamu
	const getTeamMatchResult = (token: typeof marketplaceTokens[0]) => {
		const [teamGoals, opponentGoals] = token.result.split('-').map(Number);
		if (teamGoals > opponentGoals) return 'Win';
		if (teamGoals < opponentGoals) return 'Loss';
		return 'Draw';
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="mb-8">
				<h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
					Marketplace
				</h1>
				<p className="text-xl text-gray-600">
					Buy exclusive match day collectibles from other users!
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
				// Zakładamy, że masz pliki obr1.png, obr2.png, obr3.png itd. w public/art/
				const bgImage = `/art/obr${idx + 1}.png`;
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
						{/* Content is shown when not hidden */}
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
											src={teamLogos[token.team] || token.image}
											alt={`${token.team} logo`}
											className="w-20 h-20 rounded-full object-cover border-4 border-blue-400 mb-2 bg-white bg-opacity-80"
										/>
										<span className="text-lg font-bold text-blue-300 drop-shadow">{token.team}</span>
										<Badge className="mt-1 text-xs border-blue-400 text-blue-400 bg-gray-900 bg-opacity-80">
											Token ID: {token.id}
										</Badge>
									</div>

									{/* Match info */}
									<div className="text-center mb-2">
										<div className="text-sm text-gray-300 mb-1 drop-shadow">
											<Calendar className="inline h-4 w-4 mr-1" />
											{formatDate(token.date)}
										</div>
										<div className="text-base font-semibold text-gray-100 drop-shadow">
											{token.team} vs {token.opponent}
										</div>
										<div className="text-lg font-bold text-blue-200 drop-shadow">
											Result: {token.result}
										</div>
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

									{/* Owner and price */}
									<div className="mt-auto flex flex-col items-center">
										<div className="text-xs text-gray-200 mb-1 flex items-center gap-2">
											Owner:{" "}
											<span className="break-all">
												{/* Skrócony owner: 3 pierwsze ... 3 ostatnie */}
												{token.owner.slice(0, 3)}...{token.owner.slice(-3)}
											</span>
											<button
												onClick={e => {
													e.stopPropagation();
													handleCopy(token.owner);
												}}
												className="ml-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white flex items-center"
												title="Copy address"
											>
												<Copy className="w-3 h-3 mr-1" /> Copy
											</button>
										</div>
										<div className="flex items-center gap-4 w-full justify-center">
											<div className="text-lg font-bold text-green-300 drop-shadow">
												{token.price} CHZ
											</div>
											<button
												disabled={bought.includes(token.id)}
												onClick={e => {
													e.stopPropagation();
													handleBuy(token.id);
												}}
												className={`px-4 py-2 rounded font-semibold transition ${
													bought.includes(token.id)
														? 'bg-gray-600 text-gray-300 cursor-not-allowed'
														: 'bg-blue-600 hover:bg-blue-700 text-white'
												}`}
											>
												{bought.includes(token.id) ? 'Bought' : 'Buy'}
											</button>
										</div>
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
						No collectibles available for sale right now.
					</p>
				</div>
			)}
		</div>
	);
};

export default Marketplace;