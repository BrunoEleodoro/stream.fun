'use client';
import { Input } from '@/components/ui/input';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ConnectKitButton } from 'connectkit';
import { useAccount, useChainId } from 'wagmi';
import { HoverBorderGradient } from './hover-border-gradient';
import useCreateERC20Wrapper, { TransactionStates } from '@/hooks/useCreateERC20Wrapper';
import useCreatePureSuperToken from '@/hooks/useCreatePureSuperToken';
import { blockExplorers } from '@/constants';

const TokenForm = () => {
  const [form, setForm] = useState<{
    name: string;
    symbol: string;
    icon: any;
    description: string;
  }>({
    name: '',
    symbol: '',
    icon: '',
    description: '',
  });
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [hasERC20, setHasERC20] = useState(false);
  const [erc20Address, setErc20Address] = useState('');
  const chainId = useChainId();
  const { address, isConnected } = useAccount();

  const {
    transactionState: erc20WrapperState,
    deploySupertoken: deployERC20Wrapper,
    disabled: erc20WrapperDisabled,
    errors: erc20WrapperErrors,
    supertoken,
    dataHash: erc20WrapperDataHash,
  } = useCreateERC20Wrapper({
    erc20Address,
    name: form.name,
    symbol: form.symbol,
    chainId,
  });

  const {
    transactionState: pureSuperTokenState,
    deploySuperToken: deployPureSuperToken,
    disabled: pureSuperTokenDisabled,
    errors: pureSuperTokenErrors,
    dataHash: pureSuperTokenDataHash,
  } = useCreatePureSuperToken({
    name: form.name,
    symbol: form.symbol,
    address: address ?? '',
    chainId,
  });

  const isPending =
    erc20WrapperState === TransactionStates.START ||
    pureSuperTokenState === TransactionStates.START;

  const isRejected =
    erc20WrapperState === TransactionStates.REJECTED ||
    pureSuperTokenState === TransactionStates.REJECTED;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setForm((prevForm) => ({
        ...prevForm,
        icon: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (hasERC20) {
      deployERC20Wrapper();
    } else {
      deployPureSuperToken();
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <ConnectKitButton />
      </div>
      <form
        onSubmit={handleSubmit}
        className="relative z-20 flex w-full flex-col items-center gap-4 p-6"
      >
        {isConnected && (
          <>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasERC20"
                name="tokenOption"
                checked={hasERC20}
                onChange={() => setHasERC20(!hasERC20)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="hasERC20"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                I already have an ERC20 token
              </label>
            </div>

            {hasERC20 ? (
              <>
                <Input
                  type="text"
                  name="erc20Address"
                  placeholder="ERC20 Token Address"
                  className="h-[2.5rem] w-full rounded-xl"
                  value={erc20Address}
                  onChange={(e) => setErc20Address(e.target.value)}
                  disabled={erc20WrapperDisabled}
                />
                {erc20WrapperErrors ? (
                  <div className="text-red-500">
                    <p>Error: {erc20WrapperErrors.message}</p>
                  </div>
                ) : supertoken ? (
                  <div className="text-green-500">
                    <p>Token Found: {supertoken}</p>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <Input
                  type="text"
                  name="name"
                  placeholder="Token Name"
                  className="h-[2.5rem] w-full rounded-xl"
                  value={form.name}
                  onChange={handleChange}
                  disabled={pureSuperTokenDisabled}
                />
                <Input
                  type="text"
                  name="symbol"
                  placeholder="Token Symbol"
                  className="h-[2.5rem] w-full rounded-xl"
                  value={form.symbol}
                  onChange={handleChange}
                  disabled={pureSuperTokenDisabled}
                />
                {pureSuperTokenErrors && (
                  <div className="text-red-500">
                    <p>Error: {pureSuperTokenErrors.message}</p>
                  </div>
                )}
              </>
            )}
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="flex items-center space-x-2 bg-white text-black dark:bg-black dark:text-white"
            >
              {isPending
                ? 'Loading...'
                : hasERC20
                ? 'Deploy Wrapped Token'
                : 'Deploy Pure Super Token'}
            </HoverBorderGradient>
          </>
        )}
        {isPending && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
            <div className="rounded-xl bg-white p-4">
              <p>Transaction Pending...</p>
            </div>
          </div>
        )}
        {pureSuperTokenDataHash && (
          <div className="text-green-500 text-center">
            <p>
              Transaction Hash: {pureSuperTokenDataHash}
              <br />
              <a
                href={`${blockExplorers[chainId]}/tx/${pureSuperTokenDataHash}`}
                className="underline text-center"
                target="_blank"
              >
                View on Explorer
              </a>
            </p>
          </div>
        )}
        {erc20WrapperDataHash && (
          <div className="text-green-500 text-center">
            <p>
              Transaction Hash: {erc20WrapperDataHash}
              <br />
              <a
                href={`${blockExplorers[chainId]}/tx/${erc20WrapperDataHash}`}
                className="underline text-center"
                target="_blank"
              >
                View on Explorer
              </a>
            </p>
          </div>
        )}
      </form>
    </>
  );
};

export default TokenForm;
