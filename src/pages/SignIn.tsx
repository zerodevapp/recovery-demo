import { Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function SignIn() {
  const { isConnected } = useAccount();

  if (isConnected) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
        <ConnectButton label={"Start Demo"} />
      </div>
    </>
  )
}
  