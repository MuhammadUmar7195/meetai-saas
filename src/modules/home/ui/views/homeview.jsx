"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

const HomeView = () => {
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.hello.queryOptions({ text: "Hello from TRPC!" })
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {data?.greeting}
    </div>
  );
};

export default HomeView;
