"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export const CallEnded = () => {
    return (
        <div className="flex flex-col items-center justify-center bg-radial from-sidebar-accent-foreground to-sidebar h-screen overflow-auto">
            <div className="w-full max-w-2xl py-4 px-8 flex flex-1 items-center justify-center">
                <div className="w-full flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
                    <div className="flex flex-col gap-y-2 text-center">
                        <h6 className="text-lg font-medium">You have ended the call?</h6>
                        <p className="text-muted-foreground">Summary will appear in a few minutes.</p>
                    </div>
                    <div className="flex gap-x-2 justify-center w-full">
                        <Button asChild>
                            <Link href={`/meetings`}>
                                Back to meetings
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}