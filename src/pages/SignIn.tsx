import { Navigate } from 'react-router-dom';
import { Button } from '@mantine/core';
import { usePrivy } from "@privy-io/react-auth";

export default function SignIn() {
  const { login, ready, authenticated } = usePrivy();

  if (ready && authenticated) {
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
  