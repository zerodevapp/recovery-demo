import { useRef, useEffect, useCallback } from "react";
import { RecoveryConfig, RecoveryPopupMessage, validateUserOperationCallData } from "./helpers/types";

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
      const parseUserOpCallData = validateUserOperationCallData(userOp);

      if (!parseUserOpCallData.success) {
        throw new Error(parseUserOpCallData.error.toString());
      }

      childWindowRef.current?.postMessage({
        type: 'tx-submitted',
        status: 'processing'
      } as RecoveryPopupMessage, dashboardOrigin);

      if (onUserOperation) {
        await onUserOperation(parseUserOpCallData.data);
      }

      childWindowRef.current?.postMessage({
        type: 'tx-submitted',
        status: 'done'
      } as RecoveryPopupMessage, dashboardOrigin);
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