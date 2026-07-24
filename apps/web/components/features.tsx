"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { SlotItemMapArray, utils } from "swapy";
import { DragHandle, SwapyItem, SwapyLayout, SwapySlot } from "./swapy";
import { Globe, Heart, PlusCircle } from "lucide-react";

export function ProjectViewsCard() {
  return (
    <div className="bg-white text-black rounded-xl h-full p-6 flex flex-col justify-center items-center text-center shadow-md">
      <div className="flex gap-2">
        <h2 className="2xl:text-5xl text-3xl font-bold mb-2">Down?</h2>
      </div>
      <p className="font-medium">You’ll know in seconds.</p>
      <p className="text-sm">Email, SMS we hit you up the moment things go south.</p>
    </div>
  );
}
export function NewUsersCard() {
  return (
    <div className="bg-white text-black rounded-xl h-full p-6 flex flex-col justify-center shadow-xl">
      <p className="text-lg mb-1 font-medium">Uptime Monitoring</p>
      <h2 className="2xl:text-xl text-xl font-medium leading-none">We watch your site so you don’t have to.</h2>
      <p className="text-xl font-medium mt-2">24/7 checks. No breaks. If your site blinks, we’re already on it.</p>
    </div>
  );
}
export function TeamCard() {
  return (
    <div className="bg-white text-black rounded-xl p-6 h-full  flex flex-col justify-between relative overflow-hidden shadow-md">
      <div className="bg-blue-300 text-black font-medium px-4 py-2 rounded-xl inline-block mb-4 max-w-fit">
        Super-Fast Response Tracking
      </div>
      <div>
        <p className="font-medium text-lg text-gray-800">Milliseconds matter. <br /> We show you exactly how fast (or slow) your site is.</p>
        <div className="flex items-end gap-2">
          <span className="text-6xl font-bold text-gray-900">3 Min</span>
          <span className="text-gray-500 font-medium mb-1">updates  </span>
        </div>
      </div>
    </div>
  );
}
export function AgencyCard() {
  return (
    <div className="bg-white rounded-xl h-full p-4 relative overflow-hidden shadow-md">
      <div className="bg-gray-900 text-yellow-200 text-lg font-medium px-4 py-2 rounded-lg inline-block mb-4 w-full">
        <p>Smart Digital</p>
        <p>Agency For Your</p>
        <p>Business</p>
      </div>
      <div className="flex  gap-2 h-20">
        <div className="w-full rounded-xl bg-purple-400  overflow-hidden"></div>
        <div className="w-full rounded-xl bg-yellow-200  overflow-hidden ml-4"></div>
      </div>
    </div>
  );
}
export function LogoCard() {
  return (
    <div className="bg-white text-black rounded-xl h-full p-6 flex flex-col items-center justify-center shadow-md">
      <div className="w-16 bg-blue-500 rounded-xl p-2 flex items-center justify-center h-16 mb-4">
        <Globe size={60} color="white"/>
      </div>
      <h2 className="2xl:text-3xl text-xl font-bold text-gray-900">Global Checks</h2>
      <p className="text-sm text-center">We test your site from multiple regions</p>
    </div>
  );
}
export function UserTrustCard() {
  return (
    <div className="bg-white rounded-xl h-full p-4 flex flex-col justify-center items-center text-white shadow-lg">
      <h3 className="text-2xl font-bold mb-2">Trusted By</h3>
      <p className="text-3xl font-bold mb-4">500+ Users</p>

      <div className="flex -space-x-2 mb-4">
        <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-blue-600 bg-gray-200">
        </div>
        <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-blue-600 bg-gray-200">
        </div>
        <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-blue-600 bg-gray-200">
        </div>
        <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-blue-600 bg-gray-200">
        </div>
        <div className="w-10 h-10 rounded-xl bg-yellow-500 border-2 border-blue-600 flex items-center justify-center">
          <PlusCircle className="w-5 h-5 text-white" />
        </div>
      </div>

      <p className="text-sm">Don't Take Our Words For It...</p>
    </div>
  )
}
export function FontCard() {
  return (
    <div className="bg-white text-black rounded-xl h-full p-6 col-span-1 shadow-md">
      <h2 className="text-3xl font-bold mb-1 text-gray-900">Easy Setup</h2>
      <p className="mb-6 text-gray-700">60 seconds. That’s it</p>

      <div className="flex gap-3 mt-4 ml-4">
        <ol className="list-decimal">
            <li>
        <h1 className="text-3xl">Put Link</h1>
            </li>
            <li>
        <h1 className="text-3xl">Hit Start</h1>
            </li>
            <li>
        <h1 className="text-3xl">Done</h1>
            </li>
        </ol>
      </div>
    </div>
  );
}
export function DesignIndustryCard() {
  return (
    <div className="bg-white text-black rounded-xl h-full p-6 flex flex-col justify-between relative shadow-md">
      <p className="text-2xl font-bold">Real-Time Analytics</p>
      <p className="text-2xl font-bold">Track performance, downtime, and response speed like a pro.</p>
    </div>
  );
}
export function CardBalanceCard() {
  return (
    <div className="bg-white rounded-xl h-full p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-neutral-950">Cards balance</h3>
      <h2 className="text-3xl font-bold mb-6 text-neutral-800">$ 12,457</h2>

      <div className="bg-black text-white rounded-lg p-4 shadow-xs">
        <div className="flex justify-between text-sm mb-2">
          <span >Card Holder</span>
          <span >Expires</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Robert Fox</span>
          <span>07/22</span>
        </div>
      </div>
    </div>
  )
}


type Item = {
  id: string;
  title: string;
  widgets: React.ReactNode;
  className?: string;
};

const initialItems: Item[] = [
  {
    id: "1",
    title: "1",
    widgets: <ProjectViewsCard />,
    className: "lg:col-span-4 sm:col-span-7 col-span-12",
  },
  { id: "2", title: "2", widgets: <NewUsersCard  />, className: "lg:col-span-3 sm:col-span-5 col-span-12" },
  { id: "3", title: "3", widgets: <DesignIndustryCard />, className: "lg:col-span-5 sm:col-span-5 col-span-12" },
  { id: "4", title: "4", widgets: <TeamCard/>, className: "lg:col-span-5 sm:col-span-7 col-span-12" },
  { id: "5", title: "5", widgets: <LogoCard />, className: "lg:col-span-4 sm:col-span-6 col-span-12" },
  { id: "6", title: "6", widgets: <FontCard />, className: "lg:col-span-3 sm:col-span-6 col-span-12" },
];


function DefaultSwapy() {
  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(
    utils.initSlotItemMap(initialItems, "id")
  );

  const slottedItems = useMemo(
    () => utils.toSlottedItems(initialItems, "id", slotItemMap),
    [initialItems, slotItemMap]
  );

  return (
    <SwapyLayout
      id="swapy"
      className="w-full"
      config={{
        swapMode: "hover",
      }}
      onSwap={(event: { newSlotItemMap: { asArray: any; }; }) => {
        console.log("Swap detected!", event.newSlotItemMap.asArray);
      }}
    >
      <div className="grid w-full  grid-cols-12 gap-2 md:gap-6 py-4">
        {slottedItems.map(({ slotId, itemId }) => {
          const item = initialItems.find((i) => i.id === itemId);

          return (
            <SwapySlot
              key={slotId}
              className={`swapyItem rounded-lg h-64 ${item?.className}`}
              id={slotId}
            >
              <SwapyItem
                id={itemId}
                className="relative rounded-lg w-full h-full 2xl:text-xl text-sm"
                key={itemId}
              >
                {item?.widgets}
              </SwapyItem>
            </SwapySlot>
          );
        })}
      </div>
    </SwapyLayout>
  );
}

export default DefaultSwapy;
