"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session } = authClient.useSession();

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <p className="text-lg">Welcome back, {session?.user?.name}!</p>
          <Button variant="ghost" onClick={() => authClient.signOut()} className="cursor-pointer">
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Meet.AI</h1>
        <p className="text-lg text-gray-600">Please sign in to continue</p>
        <Button onClick={() => (window.location.href = "/sign-in")} className="cursor-pointer">
          Sign In
        </Button>
      </div>
    </div>
  );
}
