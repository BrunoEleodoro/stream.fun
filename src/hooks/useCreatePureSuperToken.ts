import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import PureSuperTokenDeployerABI from '@/abis/PureSuperTokenDeployer.json';
import { parseEther } from 'viem';
import { pureSuperTokenFactories } from '@/constants';

export enum TransactionStates {
  START,
  COMPLETE,
  OUT_OF_GAS,
  REJECTED,
}

export default function useCreatePureSuperToken({
  name,
  symbol,
  address,
  chainId,
}: {
  name: string;
  symbol: string;
  address: string;
  chainId: number;
}) {
  const [transactionState, setTransactionState] = useState<TransactionStates | null>(null);

  const {
    writeContract,
    data: dataHash,
    status: writeContractStatus,
    error: writeContractError,
  } = useWriteContract();

  const { status: transactionReceiptStatus } = useWaitForTransactionReceipt({
    hash: dataHash,
    query: {
      enabled: !!dataHash,
    },
  });

  const disabled = writeContractStatus === 'pending';

  const deploySuperToken = useCallback(() => {
    writeContract(
      {
        abi: PureSuperTokenDeployerABI,
        address: pureSuperTokenFactories[chainId] as `0x`,
        functionName: 'deploySuperToken',
        args: [name, symbol, address, parseEther('1000000')],
      },
      {
        onError(error) {
          console.log({ error });
          setTransactionState(TransactionStates.REJECTED);
        },
      },
    );

    setTransactionState(TransactionStates.START);
  }, [name, symbol, address, chainId, writeContract]);

  useEffect(() => {
    if (!dataHash) return;

    if (transactionReceiptStatus === 'error') {
      if (writeContractError) {
        setTransactionState(TransactionStates.OUT_OF_GAS);
      } else {
        setTransactionState(null);
      }
    }

    if (transactionReceiptStatus === 'success') {
      setTransactionState(TransactionStates.COMPLETE);
    }
  }, [dataHash, transactionReceiptStatus, writeContractError]);

  return useMemo(
    () => ({
      disabled,
      transactionState,
      deploySuperToken,
      errors: writeContractError,
      dataHash,
    }),
    [deploySuperToken, transactionState, disabled, writeContractError, dataHash],
  );
}
