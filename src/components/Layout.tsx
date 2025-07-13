import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';
import { useBalanceRefetch, BalanceRefetchContext } from '../contexts/BalanceRefetchContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { address, isConnected } = useAccount();
  const { data: balance, refetch } = useBalance({ address });

  const isActive = (path: string) => location.pathname === path;

  return (
    <BalanceRefetchContext.Provider value={() => refetch()}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <nav className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo & Nav */}
              <div className="flex items-center space-x-8">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    Match Collectibles
                  </h1>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <Link
                      to="/"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/')
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      Home
                    </Link>
                    <Link
                      to="/auctions"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/auctions')
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      Live Auctions
                    </Link>
                    <Link
                      to="/marketplace"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/marketplace')
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      Marketplace
                    </Link>
                    <Link
                      to="/my-tokens"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/my-tokens')
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      My Tokens
                    </Link>
                    <Link
                      to="/chatbot"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/chatbot')
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      AI Search
                    </Link>
                    <Link
                      to="/contact"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/contact')
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      Contact
                    </Link>
                    <Link
                      to="/developer"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/developer')
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      Dev
                    </Link>
                  </div>
                </div>
              </div>

              {/* Wallet connect section */}
              <div className="flex items-center space-x-4">
                {isConnected && balance && (
                  <div className="text-sm text-gray-300">
                    <span className="font-medium">
                      {parseFloat(balance.formatted).toFixed(2)} {balance.symbol}
                    </span>
                  </div>
                )}
                <ConnectButton showBalance={false} />
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1">{children}</main>
      </div>
    </BalanceRefetchContext.Provider>
  );
};

export default Layout;
