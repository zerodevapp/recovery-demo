import React from "react";
import { configureChains } from "wagmi";
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { baseSepolia } from 'wagmi/chains'
import { PrivyProvider } from '@privy-io/react-auth';
import { ZeroDevPrivyWagmiProvider } from '@zerodev/wagmi/privy';
import { PRIVY_APP_ID, ZERODEV_PROJECT_IDS } from './constants';

const zeroDevOptions = {
  projectIds: ZERODEV_PROJECT_IDS,
  projectId: ZERODEV_PROJECT_IDS[0],
  useSmartWalletForExternalEOA: true,
  useRecoveredAccount: true,
}

const configureChainsConfig = configureChains([baseSepolia], [
  jsonRpcProvider({ rpc: (chain) => {
    switch (chain) {
      case baseSepolia:
        return {
          http: 'https://base-sepolia.g.alchemy.com/v2/qIpvyzx2jKfsikOHi4lvqA5G4p3RBjix',
        }
      default:
        return null
    }
  }}),
]);

function ZeroDevWrapper({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false
        },
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia]
      }}
    >
      <ZeroDevPrivyWagmiProvider wagmiChainsConfig={configureChainsConfig} options={zeroDevOptions}>
        {children}
      </ZeroDevPrivyWagmiProvider>
    </PrivyProvider>
  )
}

export default ZeroDevWrapper