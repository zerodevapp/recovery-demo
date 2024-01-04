import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { RecoveryConfig, RecoveryPopupMessage, validateUserOperationCallData } from "./helpers/types";
import useSWR from 'swr';

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json());

const useKernelAccountRecovery = ({ address, onSetupGuardianRequest }: RecoveryConfig) => {
  // TODO remove dashboard Origin
  const dashboardOrigin = process.env.REACT_APP_DASHBOARD_URL;
  const childWindowRef = useRef<Window | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  const { data } = useSWR(
    () => address ? `https://kernel-api.zerodev.app/accounts/${address}/guardians` : null, 
    fetcher,
  );

  const guardians = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.map((guardian: any) => guardian.guardian);
  }, [data]);


  const openRecoveryPopup = useCallback(() => {
    if (address === undefined) {
      return;
    }
    const parentUrl = encodeURIComponent(window.location.origin);
    const dashboardUrl = `${dashboardOrigin}/recovery-setup/${address}?parentUrl=${parentUrl}`;
    const windowFeatures = 'width=450,height=650,resizable,scrollbars=yes,status=1';
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
      if (error) {
        setError(undefined);
      }

      const { userOp } = event.data;
      const parseUserOpCallData = validateUserOperationCallData(userOp);

      if (!parseUserOpCallData.success) {
        setError('Invalid user operation call data');
        return;
      }

      childWindowRef.current?.postMessage({
        type: 'tx-submitted',
        status: 'processing'
      } as RecoveryPopupMessage, dashboardOrigin);

      if (onSetupGuardianRequest) {
        await onSetupGuardianRequest(parseUserOpCallData.data);
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
  }, [onSetupGuardianRequest]);

  return { 
    openRecoveryPopup,
    error,
    recoveryEnabled: guardians.length > 0,
    guardians,
  };
};

export default useKernelAccountRecovery;