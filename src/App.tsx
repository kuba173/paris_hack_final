import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

import { WagmiConfig } from 'wagmi';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { chilizSpicyTestnet } from './chains/chilizSpicyTestnet';
import Layout from './components/Layout';
import Index from './pages/Index';
import Auctions from './pages/Auctions';
import MyTokens from './pages/MyTokens';
import Chatbot from './pages/Chatbot';
import NotFound from './pages/NotFound';
import Contact from './pages/Contact';
import Marketplace from './pages/Marketplace';
import Developer from './pages/Developer';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

// Query klient do react-query
const queryClient = new QueryClient();

// Lista chainów
const chains = [chilizSpicyTestnet] as const;

// Poprawna konfiguracja wagmi + rainbowkit
const config = getDefaultConfig({
  appName: 'MatchDay Collectibles',
  projectId: 'YOUR_PROJECT_ID', // <- podmień na swój WalletConnect Cloud ID
  chains,
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WagmiConfig config={config}>
        <RainbowKitProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auctions" element={<Auctions />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/my-tokens" element={<MyTokens />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/developer" element={<Developer />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </RainbowKitProvider>
      </WagmiConfig>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
