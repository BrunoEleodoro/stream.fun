import { createConfig, http } from 'wagmi';
import { mainnet, polygon, base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';
import { createClient } from 'viem';
import { getDefaultConfig } from 'connectkit';

export function createWagmiConfig(rpcUrl: string, projectId?: string) {
  // Keep this till we fully deprecated RK inside the template
  if (projectId) {
    console.log('projectId:', projectId);
  }

  // Temporary hack, until we configure a FE page in OnchainKit to copy just the API key
  const baseUrl = rpcUrl.replace(/\/v1\/(.+?)\//, '/v1/base/');
  const baseSepoliaUrl = rpcUrl.replace(/\/v1\/(.+?)\//, '/v1/base-sepolia/');
  return createConfig(
    getDefaultConfig({
      ssr: true,
      // Your dApps chains
      chains: [mainnet, polygon, base, baseSepolia],
      client({ chain }) {
        return createClient({ chain, transport: http() });
      },

      // Required API Keys
      walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',

      // Required App Info
      appName: 'stream.funs',

      // Optional App Info
      appDescription: 'A great app',
      appUrl: 'https://meta-links.vercel.app', // your app's url
      appIcon: 'https://family.co/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
    }),
  );
  // return createConfig({
  //   chains: [baseSepolia, mainnet, polygon, base],
  //   connectors: [
  //     injected(),
  //     coinbaseWallet({
  //       appName: 'buildonchainapps',
  //       preference: 'smartWalletOnly',
  //     }),
  //   ],
  //   ssr: true,

  //   client({ chain }) {
  //     return createClient({ chain, transport: http() });
  //   },
  // });
}
