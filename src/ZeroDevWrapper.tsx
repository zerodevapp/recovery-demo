import React from "react";
import { configureChains } from "wagmi";
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { arbitrumSepolia } from 'wagmi/chains'
import { PrivyProvider } from '@privy-io/react-auth';
import { ZeroDevPrivyWagmiProvider } from '@zerodev/wagmi/privy';
import { PRIVY_APP_ID, ZERODEV_PROJECT_IDS } from './constants';

console.log({ PRIVY_APP_ID, ZERODEV_PROJECT_IDS })
const zeroDevOptions = {
  projectIds: ZERODEV_PROJECT_IDS,
  projectId: ZERODEV_PROJECT_IDS[0],
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
      appId={PRIVY_APP_ID}
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