import NftMint from "../components/NftMint"
import Account from "../components/Account"
import { Navigate } from "react-router-dom"
import { usePrivy } from "@privy-io/react-auth"

export default function Home() {
  const { ready, authenticated } = usePrivy();

  if (ready && !authenticated) {
    return <Navigate to="/signin" />;
  }
  return (
    <div>
      <div className="flex flex-row py-24 px-12">
        <div className="w-1/2">
          <NftMint />
        </div>
        <div className="w-1/2">
          <Account />
        </div>
      </div>
      <p className="w-full text-center">
        To execute recovery visit the ZeroDev account portal
        {" "}
        <a
          className="text-blue-500 underline"
          href="https://recovery.zerodev.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
      </p>
    </div>
  )
}
