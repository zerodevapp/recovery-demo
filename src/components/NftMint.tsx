
import { useCallback, useState, useEffect, useRef } from 'react';
import { Button, Anchor } from '@mantine/core';
import contractAbi from "../contracts/polygon-mumbai/0x34bE7f35132E97915633BC1fc020364EA5134863.json";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useNetwork
} from "wagmi";
import { usePrivy } from "@privy-io/react-auth";

export default function NftMint() {
  const { address } = useAccount();
  const { chain } = useNetwork()
  const [balanceChanging, setBalanceChanging] = useState(false)
  const { logout } = usePrivy();

  const { config } = usePrepareContractWrite({
    address: "0x34bE7f35132E97915633BC1fc020364EA5134863",
    abi: contractAbi,
    functionName: "mint",
    args: [address],
    enabled: !!address
  });
  const { write: mint } = useContractWrite(config);

  const { data: balance = 0, refetch } = useContractRead({
    address: "0x34bE7f35132E97915633BC1fc020364EA5134863",
    abi: contractAbi,
    functionName: "balanceOf",
    args: [address],
    enabled: !!address
  });

  useEffect(() => {
    setBalanceChanging(false)
  }, [balance])

  const interval = useRef<any>()
  useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current)
    }
  }, [balance, interval]);

  const handleClick = useCallback(() => {
    if (mint) {
      setBalanceChanging(true)
      mint()
      interval.current = setInterval(() => {
        refetch()
      }, 1000)
      setTimeout(() => {
        if (interval.current) {
          clearInterval(interval.current)
        }
      }, 100000)
    }
  }, [mint, refetch])

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4">
        <strong style={{ fontSize: '1.5rem' }}>NFT Count</strong>
        <div style={{ fontSize: "2rem", fontWeight: 'medium', width: 100, height: 100, borderRadius: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', border: '10px solid #2B8DE3' }}>{`${balance ?? 0}`}</div>
        <Button
            loading={balanceChanging}
            size={'lg'}
            onClick={handleClick}
        >
            Gas-free Mint
        </Button>
        {chain?.blockExplorers?.default.url && <Anchor href={`${chain?.blockExplorers?.default.url}/address/${address}#tokentxnsErc721`} target="_blank">Block Explorer</Anchor>}
      </div>
      <div className="flex items-center justify-center py-8">
        <Button
            size="compact-md"
            onClick={logout}
            variant="light"
        >
            Disconnect
        </Button>
      </div>
    </>
  )
}
  