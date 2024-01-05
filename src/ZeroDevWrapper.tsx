import React from "react";
import { configureChains } from "wagmi";
import { infuraProvider } from 'wagmi/providers/infura'
import { polygonMumbai } from 'wagmi/chains'
import {PrivyProvider} from '@privy-io/react-auth';
import {ZeroDevPrivyWagmiProvider} from '@zerodev/wagmi/privy';
import { PRIVY_APP_ID, ZERODEV_PROJECT_IDS } from './constants';

const configureChainsConfig = configureChains([polygonMumbai], [infuraProvider({apiKey: 'f36f7f706a58477884ce6fe89165666c'})]);
const zeroDevOptions = {
  projectIds: ZERODEV_PROJECT_IDS,
  projectId: ZERODEV_PROJECT_IDS[0],
  useSmartWalletForExternalEOA: true,
  useRecoveredAccount: true,
}

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [infuraProvider({apiKey: 'f36f7f706a58477884ce6fe89165666c'})]
)

function ZeroDevWrapper({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false
        },
        defaultChain: polygonMumbai,
        supportedChains: [polygonMumbai]
      }}
    >
      <ZeroDevPrivyWagmiProvider wagmiChainsConfig={configureChainsConfig} options={zeroDevOptions}>
        {children}
      </ZeroDevPrivyWagmiProvider>
    </PrivyProvider>
  )
}

export default ZeroDevWrapper