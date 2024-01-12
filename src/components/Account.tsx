import { useAccount, useNetwork } from "wagmi"
import { Button } from '@mantine/core';
import { useKernelAccountRecovery } from "@zerodev/recovery";
import { useWallets } from "@privy-io/react-auth";
import { useEcdsaProvider } from "@zerodev/wagmi";

export default function Account() {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const ecdsaProvider = useEcdsaProvider();
  const {wallets: eoaWallets} = useWallets();

  const { openRecoveryPopup, recoveryEnabled, guardians, isPending } = useKernelAccountRecovery({
    chainId: chain?.id ?? 421614,
    address,
    suggestedGuardianAddress: "0x517CF7C9606B30a1b4723f2E40780033dBDD36e5",
    onSetupGuardianRequest: async (userOpCallData) => {
      if (!ecdsaProvider) {
        console.log('ecdsaProvider not found');
        return;
      }
      try {
        const { hash } = await ecdsaProvider.sendUserOperation(userOpCallData);
        await ecdsaProvider.waitForUserOperationTransaction(hash as `0x${string}`);
      } catch (e) {
        console.log(e);
      }
    }
  });

  return (
    <div>
      <h2 className="text-base font-semibold leading-7 text-gray-900">Account Recovery</h2>
      <p className="mt-1 text-sm leading-6 text-gray-500">
        View your account details.
      </p>

      <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
        <div className="pt-6 sm:flex">
          <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Kernel Account Address</dt>
          <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
            <div className="text-gray-900">{address}</div>
          </dd>
        </div>
        <div className="pt-6 sm:flex">
          <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Signer Address</dt>
          <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
            <div className="text-gray-900">{eoaWallets[0]?.address}</div>
          </dd>
        </div>
        <div className="pt-6 sm:flex">
          <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Guardian</dt>
          <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
            <div className="text-gray-900">{guardians.length > 0 ? guardians.join(', ') : 'No guardians'}</div>
          </dd>
        </div>
      </dl>
      <div className="pt-8">
        <Button
            loading={isPending}
            size="compact-md"
            onClick={openRecoveryPopup}
        >
            {recoveryEnabled ? "Update Guardian" : "Set Guardian"}
        </Button>
      </div>
    </div>
  )
}