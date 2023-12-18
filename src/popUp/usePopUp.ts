import { useRef, useEffect } from "react";
import { useAccount } from "wagmi";
import { useEcdsaProvider } from "@zerodev/wagmi";

const usePopUp = () => {
  const ecdsaProvider = useEcdsaProvider();
  const { address } = useAccount();
  const dashboardOrigin = process.env.REACT_APP_DASHBOARD_URL;
  const childWindowRef = useRef<Window | null>(null);

  const openChildWindow = (address?: string) => {
    if (address === undefined) {
      return;
    }
    const parentUrl = encodeURIComponent(window.location.origin);
    const dashboardUrl = `${dashboardOrigin}/recovery-setup/${address}?parentUrl=${parentUrl}`;
    const windowFeatures = 'width=800,height=600,resizable,scrollbars=yes,status=1';
    childWindowRef.current = window.open(dashboardUrl, '_blank', windowFeatures);

    if (childWindowRef.current) {
      childWindowRef.current.focus();
    }
  };

  useEffect(() => {
    const dashboardOrigin = process.env.REACT_APP_DASHBOARD_URL;
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== dashboardOrigin) {
        // Validate the message origin
        console.log('Invalid origin', event.origin);
        return;
      }

      console.log('Message from the dashboard:', event.data);
      if (ecdsaProvider) {
        childWindowRef.current?.postMessage({ type: 'tx-submitted', status: 'processing' }, dashboardOrigin);
        const { hash } = await ecdsaProvider.sendUserOperation(event.data.userOp);
        console.log('userop hash' , hash)
        const txhash = await ecdsaProvider.waitForUserOperationTransaction(hash as any)
        console.log('it worked!', txhash);
        childWindowRef.current?.postMessage({ type: 'tx-submitted', status: 'done' }, dashboardOrigin);
      } else {
        console.log('ecdsaProvider is not defined', address);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [ecdsaProvider]);

  return { 
    openChildWindow,
    childWindowRef
  };
};

export default usePopUp;