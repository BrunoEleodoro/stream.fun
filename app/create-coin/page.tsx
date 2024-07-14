'use client';

import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Logo from '../../public/images/logo.png';
import GifDuck from '../../public/images/pato.gif';
import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';

export default function CreateCoin() {
  const [fileName, setFileName] = useState('Click to upload image');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFileName(event.target.files[0].name);
    }
  };

  return (
    <>
      <head>
        <title>Stream Fun</title>
        <meta name="description" content="Your super token creation community" key="desc" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center rounded-md bg-neutral-950 bg-custom-bg bg-cover antialiased">
        <div className="flex w-full flex-col space-y-5">
          <Image src={Logo} alt="logo" className="w-44 self-center" />
          <div className="grid grid-cols-3 place-content-center gap-2">
            <div className="col-span-2 flex w-1/2 flex-col space-y-5 place-self-end">
              <div className="flex flex-col space-y-5">
                <Input
                  type="text"
                  name="name"
                  label="Name"
                  className="h-[3.5rem] w-full rounded-xl !text-xl text-black"
                />
                <Input
                  type="text"
                  name="ticker"
                  label="Ticker"
                  className="h-[3.5rem] w-full rounded-xl !text-xl text-black"
                />
                <Input
                  type="text"
                  name="description"
                  label="Description"
                  className="h-[3.5rem] w-full rounded-xl !text-xl text-black"
                />
                <div className="relative">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    name="image"
                    label="Image"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    onClick={handleButtonClick}
                    className="flex h-9 h-[3.5rem] w-full w-full !cursor-pointer rounded-md rounded-xl border border-input bg-white/70 px-3 py-1 !text-xl text-sm text-black shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {fileName}
                  </Button>
                </div>
                <Button className="h-12 w-full rounded-xl bg-gradient-to-r from-[#FFD80F] to-[#FE44CA] text-xl font-bold uppercase text-white hover:from-[#FFD80F]/80 hover:to-[#FE44CA]/80">
                  Create a coin
                </Button>
                <div className="text-lg font-bold text-black"> Cost to deploy: ~0.02 SOL</div>
              </div>
            </div>
            <div className="col-span-1 flex place-content-center">
              <Image src={GifDuck} alt="Duck" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
