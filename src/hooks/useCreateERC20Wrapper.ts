import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi';
import { Abi, TransactionExecutionError } from 'viem';
import WrappedSuperTokenDeployer from '@/abis/WrappedSuperToken.json';
import { wrappedSuperTokenFactories } from '@/constants';

export enum TransactionStates {
  START,
  COMPLETE,
  OUT_OF_GAS,
  REJECTED,
}

export default function useCreateERC20Wrapper({
  erc20Address,
  name,
  symbol,
  chainId,
}: {
  erc20Address: string;
  name: string;
  symbol: string;
  chainId: number;
}) {
  const [transactionState, setTransactionState] = useState<TransactionStates | null>(null);
  const [supertoken, setSupertoken] = useState<string | null>(null);

  const { data: simulateData, error: simulateError } = useSimulateContract({
    address: wrappedSuperTokenFactories[chainId] as `0x`,
    abi: WrappedSuperTokenDeployer,
    functionName: 'createERC20Wrapper',
    args: [erc20Address, 1, name, symbol],
  });

  const {
    writeContract,
    data: dataHash,
    status: writeContractStatus,
    error: writeContractError,
  } = useWriteContract({});

  const { status: transactionReceiptStatus, data: transactionReceiptData } =
    useWaitForTransactionReceipt({
      hash: dataHash,
      query: {
        enabled: !!dataHash,
      },
    });

  const disabled = writeContractStatus === 'pending';
  console.log({ writeContractError });
  const deploySupertoken = useCallback(() => {
    if (simulateData) {
      writeContract(simulateData.request, {
        onError(error) {
          console.log({ error });
          setTransactionState(TransactionStates.REJECTED);
        },
      });
      setTransactionState(TransactionStates.START);
    } else {
      setTransactionState(null);
    }
  }, [simulateData, writeContract]);

  useEffect(() => {
    if (!dataHash) return;

    if (transactionReceiptStatus === 'error') {
      if (writeContractError === TransactionExecutionError.name) {
        setTransactionState(TransactionStates.OUT_OF_GAS);
      } else {
        setTransactionState(null);
      }
    }

    if (transactionReceiptStatus === 'success') {
      setTransactionState(TransactionStates.COMPLETE);
      const supertokenAddress = transactionReceiptData?.logs[4]?.topics[1];
      setSupertoken(supertokenAddress ?? null);
    }
  }, [dataHash, transactionReceiptStatus, writeContractError]);

  return useMemo(
    () => ({
      disabled,
      transactionState,
      deploySupertoken,
      supertoken,
      errors: simulateError,
      dataHash,
    }),
    [deploySupertoken, transactionState, disabled, simulateError, supertoken, dataHash],
  );
}
