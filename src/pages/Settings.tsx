import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ZeroDevWeb3Auth } from '@zerodev/web3auth';
import { useEcdsaProvider } from "@zerodev/wagmi";
import useKernelAccountRecovery from "../popUp/useKernelAccountRecovery";

type User = {
  email: string;
  name: string;
}

export default function Settings() {
  const { isConnected, address } = useAccount();
  const ecdsaProvider = useEcdsaProvider();
  const [user, setUser] = useState<User | undefined>();
  const { openRecoveryPopup } = useKernelAccountRecovery({
    address,
    onUserOperation: async (userOp) => {
      console.log('ecdsaProvider', ecdsaProvider);
      if (!ecdsaProvider) return;
      const { hash } = await ecdsaProvider.sendUserOperation(userOp);
      const txhash = await ecdsaProvider.waitForUserOperationTransaction(hash as `0x${string}`);
      // return txhash;
    }
  });

  useEffect(() => {
    if (isConnected) {
      const getUserDetails = async () => {
          const zeroDevWeb3Auth = ZeroDevWeb3Auth.getInstance([process.env.REACT_APP_ZERODEV_PROJECT_ID || 'b5486fa4-e3d9-450b-8428-646e757c10f6'])
          const userDetails = await zeroDevWeb3Auth.getUserInfo();
          if (userDetails.email && userDetails.name) {
            setUser({ email: userDetails.email, name: userDetails.name });
          }
      };
      getUserDetails();
    }
}, [isConnected])
  
  return (
    <>
      <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Information associated with your connected profile.
          </p>

          <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Full name</dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">{user?.name}</div>
              </dd>
            </div>
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Email address</dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">{user?.email}</div>
              </dd>
            </div>
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Smart Account address</dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">{address}</div>
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Smart Contract Account</h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">Information and options associate with your smart account.</p>

          <ul className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            <li className="flex justify-between gap-x-6 py-6">
              <div className="font-medium text-gray-900">Recovery Options</div>
              <button
                type="button"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
                onClick={() => openRecoveryPopup()}
              >
                Update
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
