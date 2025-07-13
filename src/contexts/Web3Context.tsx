
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  chzBalance: number;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  stakeChz: (amount: number, matchId: string, team: string) => Promise<boolean>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chzBalance, setChzBalance] = useState(1000); // Mock balance

  const isConnected = !!account;

  const connectWallet = async () => {
    try {
      // Mock wallet connection
      const mockAccount = '0x' + Math.random().toString(16).substr(2, 40);
      setAccount(mockAccount);
      toast({
        title: "Wallet Connected",
        description: `Connected to ${mockAccount.substring(0, 10)}...`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const stakeChz = async (amount: number, matchId: string, team: string): Promise<boolean> => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return false;
    }

    if (amount > chzBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough CHZ tokens",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Mock staking transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      setChzBalance(prev => prev - amount);
      
      toast({
        title: "Stake Successful",
        description: `Staked ${amount} CHZ for ${team} in match ${matchId}`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Staking Failed",
        description: "Failed to stake CHZ tokens",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        isConnected,
        chzBalance,
        connectWallet,
        disconnectWallet,
        stakeChz,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
