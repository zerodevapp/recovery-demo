import { useAccount } from "wagmi"
import { Button } from '@mantine/core';
import { useKernelAccountRecovery } from "@zerodev/recovery";
import { useEcdsaProvider } from "@zerodev/wagmi";
// import useKernelAccountRecovery from "../popUp/useKernelAccountRecovery";

export default function Account() {
  const { address } = useAccount();
  const ecdsaProvider = useEcdsaProvider();
  const { openRecoveryPopup, recoveryEnabled, guardians } = useKernelAccountRecovery({
    address,
    onSetupGuardianRequest: async (userOpCallData) => {
      if (!ecdsaProvider) {
        console.log('ecdsaProvider not found');
        return;
      }
      const { hash } = await ecdsaProvider.sendUserOperation(userOpCallData);
      await ecdsaProvider.waitForUserOperationTransaction(hash as `0x${string}`);
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
          <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Kernel SCW Address</dt>
          <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
            <div className="text-gray-900">{address}</div>
          </dd>
        </div>
        <div className="pt-6 sm:flex">
          <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Signer Address</dt>
          <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
            <div className="text-gray-900">todo</div>
          </dd>
        </div>
        <div className="pt-6 sm:flex">
          <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Guardian</dt>
          <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
            <div className="text-gray-900">{guardians.length > 0 ? guardians.join(', ') : 'No guardians'}</div>
          </dd>
        </div>
      </dl>
      <div className="py-8">
        <Button
            size="compact-md"
            onClick={openRecoveryPopup}
        >
            {recoveryEnabled ? "Update Guardian" : "Set Guardian"}
        </Button>
      </div>
    </div>
  )
}