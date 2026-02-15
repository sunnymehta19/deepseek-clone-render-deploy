import React from "react";

const AppSkeleton = () => {
  return (
    <div className="flex h-screen bg-[#151517] text-white animate-pulse">

      <div className="hidden md:flex flex-col w-66 bg-[#1b1b1c] p-4 space-y-6">
        <div className="h-6 w-28 bg-[#2c2c2e] rounded-md" />
        <div className="h-10 w-full bg-[#2c2c2e] rounded-full" />

        <div className="space-y-3 mt-6">
          <div className="h-4 w-24 bg-[#2c2c2e] rounded-md" />
          <div className="h-8 w-full bg-[#2c2c2e] rounded-lg" />
          <div className="h-8 w-5/6 bg-[#2c2c2e] rounded-lg" />
          <div className="h-8 w-4/6 bg-[#2c2c2e] rounded-lg" />
        </div>

        <div className="mt-auto h-10 w-full bg-[#2c2c2e] rounded-xl" />
      </div>

      <div className="flex-1 flex flex-col px-4 md:px-8 py-6 space-y-8">

        <div className="flex justify-end">
          <div className="h-10 w-60 bg-[#2c2c2e] rounded-3xl" />
        </div>

        <div className="space-y-4 max-w-3xl">
          <div className="h-4 w-40 bg-[#2c2c2e] rounded-md" />
          <div className="h-4 w-full bg-[#2c2c2e] rounded-md" />
          <div className="h-4 w-5/6 bg-[#2c2c2e] rounded-md" />
          <div className="h-4 w-4/6 bg-[#2c2c2e] rounded-md" />
        </div>

        <div className="mt-auto max-w-3xl">
          <div className="h-20 w-full bg-[#2c2c2e] rounded-3xl" />
        </div>
      </div>
    </div>
  );
};

export default AppSkeleton;
