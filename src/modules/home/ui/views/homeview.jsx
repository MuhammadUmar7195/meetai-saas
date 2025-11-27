"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Video, 
  FileText, 
  ArrowRight,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const HomeView = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}
        </h1>
        <p className="text-muted-foreground">
          Your AI-powered meeting assistant platform
        </p>
      </div>

      {/* How It Works */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>How Meet.AI Works</CardTitle>
          <CardDescription>
            Transform your meetings in 3 simple steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  1
                </div>
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Create AI Agent</h3>
              <p className="text-sm text-muted-foreground">
                Set up an AI agent with custom instructions for your meeting needs
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  2
                </div>
                <Video className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Schedule Meeting</h3>
              <p className="text-sm text-muted-foreground">
                Create a meeting and your AI agent joins automatically
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  3
                </div>
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Get Insights</h3>
              <p className="text-sm text-muted-foreground">
                Receive automatic transcripts and AI-generated summaries
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problems Solved */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What Problems Does This Solve?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">No More Manual Notes</h4>
                <p className="text-sm text-muted-foreground">
                  AI automatically transcribes and documents everything
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Never Miss Action Items</h4>
                <p className="text-sm text-muted-foreground">
                  AI extracts key decisions and tasks automatically
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Searchable Meeting History</h4>
                <p className="text-sm text-muted-foreground">
                  Find any meeting discussion or decision instantly
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Save 80% of Time</h4>
                <p className="text-sm text-muted-foreground">
                  Eliminate post-meeting documentation work
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/agents")}>
          <CardHeader>
            <Bot className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Manage AI Agents</CardTitle>
            <CardDescription>
              Create and customize AI agents for your meetings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full gap-2">
              Go to Agents
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/meetings")}>
          <CardHeader>
            <Video className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Your Meetings</CardTitle>
            <CardDescription>
              Schedule and manage all your AI-powered meetings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full gap-2">
              Go to Meetings
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeView;
