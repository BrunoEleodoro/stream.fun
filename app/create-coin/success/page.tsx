'use client';

import Image from 'next/image';
import GifDuck from '../../../public/images/pato.gif';
import GifCheck from '../../../public/images/Check.gif';
import Logo from '../../../public/images/logo.png';

export default function CreateCoinSuccess() {
  return (
    <>
      <head>
        <title>Stream Fun</title>
        <meta name="description" content="Your super token creation community" key="desc" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center rounded-md bg-neutral-950 bg-custom-bg bg-cover antialiased">
        <Image src={Logo} alt="logo" className="w-44 self-center" />
        <div className="flex w-4/12 flex-col space-y-5 rounded-lg bg-white p-10 text-center text-black shadow-lg">
          <Image src={GifDuck} alt="Duck" className="w-72 self-center" />
          <Image src={GifCheck} alt="Duck" className="w-32 self-center" />
          <div className="text-2xl font-bold uppercase text-black">coin created successfully</div>
        </div>
      </div>
    </>
  );
}
