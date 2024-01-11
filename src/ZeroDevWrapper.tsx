import React from "react";
import { configureChains } from "wagmi";
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { arbitrumSepolia } from 'wagmi/chains'
import { PrivyProvider } from '@privy-io/react-auth';
import { ZeroDevPrivyWagmiProvider } from '@zerodev/wagmi/privy';
import { PRIVY_APP_ID, ZERODEV_PROJECT_IDS } from './constants';

// https://arbitrum-sepolia.infura.io/v3/${INFURA_API_KEY}
// 'https://optimism-sepolia.infura.io/v3/${INFURA_API_KEY}'

console.log({ PRIVY_APP_ID, ZERODEV_PROJECT_IDS })
const zeroDevOptions = {
  projectIds: ['2d2d0381-ba44-4a5f-a613-1dfbb5c21fa8'],
  projectId: '2d2d0381-ba44-4a5f-a613-1dfbb5c21fa8',
  useSmartWalletForExternalEOA: true,
  useRecoveredAccount: true,
}

const configureChainsConfig = configureChains([arbitrumSepolia], [jsonRpcProvider({
  rpc: () => ({
    http: 'https://arbitrum-sepolia.infura.io/v3/f36f7f706a58477884ce6fe89165666c'
  })
})]);

function ZeroDevWrapper({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId={'clr5fbl4q0207i50fj7tupzdf'}
      config={{
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false
        },
        defaultChain: arbitrumSepolia,
        supportedChains: [arbitrumSepolia]
      }}
    >
      <ZeroDevPrivyWagmiProvider wagmiChainsConfig={configureChainsConfig} options={zeroDevOptions}>
        {children}
      </ZeroDevPrivyWagmiProvider>
    </PrivyProvider>
  )
}

export default ZeroDevWrapper