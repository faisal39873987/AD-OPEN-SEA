import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center">
        <div className="relative h-24 w-24 animate-pulse">
          <Image 
            src="/logos/logo.png" 
            alt="AD Pulse Logo" 
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="mt-4 h-2 w-24 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-blue-700"></div>
      </div>
    </div>
  );
}
