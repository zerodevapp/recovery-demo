import { Navigate } from 'react-router-dom';
import { Button } from '@mantine/core';
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from 'wagmi';

export default function SignIn() {
  const { login } = usePrivy();
  const { isConnected } = useAccount();

  if (isConnected) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
        <Button
            size={'lg'}
            onClick={login}
        >
            Start Demo
        </Button>
      </div>
    </>
  )
}
  