import { useRef, useEffect, useCallback } from "react";

export interface UserOperationCallData {
  /* the target of the call */
  target: `0x${string}`;
  /* the data passed to the target */
  data: `0x${string}`;
  /* the amount of native token to send to the target (default: 0) */
  value?: bigint;
}

type RecoveryConfig = {
  address?: `0x${string}`;
  onUserOperation: (userOpCallData: UserOperationCallData) => Promise<void>;
}

const useKernelAccountRecovery = ({ address, onUserOperation }: RecoveryConfig) => {
  // TODO remove dashboard Origin
  const dashboardOrigin = process.env.REACT_APP_DASHBOARD_URL;
  const childWindowRef = useRef<Window | null>(null);

  const openRecoveryPopup = useCallback(() => {
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
  }, [address, dashboardOrigin]);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== dashboardOrigin) {
        // Ignore messages from other origins
        return;
      }

      const { userOp } = event.data;
      childWindowRef.current?.postMessage({ type: 'tx-submitted', status: 'processing' }, dashboardOrigin);

      if (onUserOperation) {
        await onUserOperation(userOp);
      }

      childWindowRef.current?.postMessage({ type: 'tx-submitted', status: 'done' }, dashboardOrigin);
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onUserOperation]);

  return { 
    openRecoveryPopup,
  };
};

export default useKernelAccountRecovery;