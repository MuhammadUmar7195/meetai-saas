"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const HomeView = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <p className="text-lg">Loged in as {session?.user?.name}!</p>
        <Button
          onClick={() =>
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => router.push("/sign-in"),
              },
            })
          }
          className="cursor-pointer"
        >
          Sign out
        </Button>
      </div>
    </div>
  );
};

export default HomeView;
