import NftMint from "../components/NftMint"
import Account from "../components/Account"
import { useAccount } from "wagmi"
import { Navigate } from "react-router-dom"

export default function Home() {
  const { isConnected } = useAccount();

  if (!isConnected) {
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
