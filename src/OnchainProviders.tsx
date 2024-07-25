'use client';

import { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base, baseSepolia } from 'viem/chains';
import { WagmiProvider } from 'wagmi';
import { createWagmiConfig } from '@/store/createWagmiConfig';
import { ConnectKitProvider } from 'connectkit';

type Props = { children: ReactNode };

const queryClient = new QueryClient();

const rpcUrl = '/api/rpc';

const wagmiConfig = createWagmiConfig(rpcUrl);

function OnchainProviders({ children }: Props) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <OnchainKitProvider chain={base}>{children}</OnchainKitProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default OnchainProviders;
