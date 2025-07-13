from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from web3 import Web3
import json

# I KNOW THAT I SCHOULD NOT PUBLISH PRIVATE KEYS PUBLICLY, THIS IS JUST A DEMO! 
# ANY ACCOUNT ONLY HOLD TEST TOKENS, SO IT'S SAFE TO USE IN THIS EXAMPLE.
# I DID NOT HAVE TIME TO SET UP .env FILES, SO I PUT EVERYTHING HERE FOR DEMO PURPOSES.

# ✅ Chiliz RPC + smart contract info (bez .env)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ======= KONFIGURACJA =======
INFURA_URL = "https://spicy-rpc.chiliz.com/"
PRIVATE_KEY = "f2c788a2962499fcc1ae34c23ecb9f4578f7eb9974740e20b84e3bffd9e65540"
ACCOUNT_ADDRESS = "0x2583d3a162A594e9B42A52505f683eE9b8bd8903"
CONTRACT_ADDRESS = "0x9284946D013baDa6ED25bDeb6F6b134AF348DB51"

# ======= ABI (skrót tylko potrzebne funkcje) =======
ABI = [
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
]

# ======= Inicjalizacja Web3 i kontraktu =======
web3 = Web3(Web3.HTTPProvider(INFURA_URL))
contract = web3.eth.contract(address=Web3.to_checksum_address(CONTRACT_ADDRESS), abi=ABI)

def send_transaction(fn, *args, value=0, nonce=None):
    try:
        if nonce is None:
            nonce = web3.eth.get_transaction_count(ACCOUNT_ADDRESS)
        
        print(f"Using nonce: {nonce}")
        
        # Zwiększ cenę gazu o 30% od aktualnej dla pewności
        gas_price = int(web3.eth.gas_price * 1.3)
        print(f"Gas price: {gas_price}")

        # Buduj transakcję ze zwiększonym gas price
        tx = fn(*args).build_transaction({
            'from': ACCOUNT_ADDRESS,
            'value': value,
            'nonce': nonce,
            'gasPrice': gas_price,
            'gas': 2000000  # Ustaw bezpieczny limit gazu
        })

        print(f"Transaction built: {tx}")

        # Podpisz i wyślij transakcję
        signed_tx = web3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        print(f"Transaction signed. Raw transaction available: {hasattr(signed_tx, 'raw_transaction')}")
        
        if not hasattr(signed_tx, 'raw_transaction'):
            raise Exception("No raw_transaction in signed transaction")
            
        tx_hash = web3.eth.send_raw_transaction(signed_tx.raw_transaction)
        print(f"Transaction sent: {web3.to_hex(tx_hash)}")
        
        # Poczekaj na potwierdzenie
        receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        if receipt['status'] != 1:
            raise Exception("Transaction failed")
            
        return web3.to_hex(tx_hash)
    except Exception as e:
        print(f"Transaction error: {str(e)}")
        print(f"Error type: {type(e)}")
        raise



# ======= MODELE Pydantic =======
class CreateAuctionRequest(BaseModel):
    matchId: int
    team: str
    durationInSeconds: int


class StakeRequest(BaseModel):
    auctionId: int
    amountInEther: str


class FinalizeRequest(BaseModel):
    auctionId: int


# ======= ENDPOINTY =======

@app.post("/create-auction")
def create_auction(req: CreateAuctionRequest):
    try:
        print(f"Creating auction: matchId={req.matchId}, team={req.team}, duration={req.durationInSeconds}")
        
        # Sprawdź, czy duration jest sensowne
        if req.durationInSeconds <= 0:
            raise HTTPException(status_code=400, detail="Duration must be positive")
            
        # Sprawdź, czy matchId jest sensowne
        if req.matchId <= 0:
            raise HTTPException(status_code=400, detail="Invalid match ID")

        # Pobierz aktualny nonce
        nonce = web3.eth.get_transaction_count(ACCOUNT_ADDRESS)
        
        # Wyślij transakcję ze zwiększonym gas price
        tx_hash = send_transaction(
            contract.functions.createAuction,
            req.matchId,
            req.team,
            req.durationInSeconds,
            nonce=nonce  # Użyj tego samego nonce dla obu transakcji
        )
        
        print(f"Auction created successfully: {tx_hash}")
        return {
            "status": "Auction created", 
            "txHash": tx_hash,
            "nonce": nonce  # Zwróć nonce do frontendu
        }
    except Exception as e:
        print(f"Error creating auction: {str(e)}")
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(status_code=500, detail=f"Failed to create auction: {str(e)}")


@app.post("/stake")
def stake(req: StakeRequest):
    try:
        value_wei = web3.to_wei(req.amountInEther, 'ether')
        tx_hash = send_transaction(
            contract.functions.stake,
            req.auctionId,
            value=value_wei
        )
        return {"status": "Staked", "txHash": tx_hash}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/finalize")
def finalize(req: FinalizeRequest):
    try:
        tx_hash = send_transaction(
            contract.functions.finalizeAuction,
            req.auctionId
        )
        return {"status": "Finalized", "txHash": tx_hash}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/auctions")
def get_auctions():
    try:
        data = contract.functions.getFullAuctionData().call()
        auctions = []
        for a in data:
            auctions.append({
                "auctionId": a[0],
                "matchId": a[1],
                "team": a[2],
                "endTime": a[3],
                "highestBidder": a[4],
                "highestStake": float(web3.from_wei(a[5], "ether")),
                "finalized": a[6],
                "stakers": [
                    {"user": s[0], "amount": float(web3.from_wei(s[1], "ether"))}
                    for s in a[7]
                ]
            })
        return auctions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8090)