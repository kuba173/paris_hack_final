import { Chain } from 'wagmi';

export const chilizSpicyTestnet: Chain = {
  id: 88882,
  name: 'Chiliz Spicy Testnet',
  network: 'chiliz-spicy',
  nativeCurrency: {
    name: 'Chiliz',
    symbol: 'CHZ',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://spicy-rpc.chiliz.com'],
    },
    public: {
      http: ['https://chiliz-spicy.publicnode.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Chiliz Explorer',
      url: 'https://spicy-explorer.chiliz.com',
    },
  },
  testnet: true,
};
