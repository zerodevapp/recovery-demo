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
    <div className="flex flex-row py-24 px-12">
      <div className="w-1/2">
        <NftMint />
      </div>
      <div className="w-1/2">
        <Account />
      </div>
    </div>
  )
}
