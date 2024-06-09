'use client';

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex h-screen place-items-center justify-center bg-white">
      <div className="flex flex-col md:flex-row items-center">
        <video
          src="/Designer.mp4"
          width={400}
          height={400}
          className="bg-no-repeat"
          autoPlay
          controls={false}
          loop={false}
          muted
          playsInline
        />
        <div className="flex flex-col w-60 m-5 p-5 text-center justify-center">
          <h1 className="font-bold mb-5">SupplierMax</h1>
          <p className="text-sm text-[#212224]">Streamlining Supplier Management for Maximum Efficiency and Success</p>

          <button 
            className="bg-gradient-to-r from-[#3ad1b0] via-[#8693e3] to-[#7e61da] text-[#EFF0F1] text-[#08201a] 
            transition-transform duration-300
            mt-5 p-3 rounded-md font-bold hover:scale-105 hover:shadow-xl 
            hover:bg-gradient-to-l from-[#7e61da] via-[#8693e3] to-[#3ad1b0]"
            onClick={() => router.push("/dashboard")}
          >
            Get Started
          </button>
        </div>
      </div>
    </main>
  );
}
