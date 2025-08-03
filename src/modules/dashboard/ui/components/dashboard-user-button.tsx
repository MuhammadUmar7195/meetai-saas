"use client";

import { authClient } from "@/lib/auth-client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GenerateAvatar } from "@/components/generateAvatar";
import { IoIosArrowDown } from "react-icons/io";
import { PiCreditCardFill } from "react-icons/pi";
import { TbLogout } from "react-icons/tb";
import { useRouter } from "next/navigation";

const DashboardUserButton = () => {
    const router = useRouter();
    const { data, isPending } = authClient.useSession();

    const onLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in");
                }
            }
        })
    }

    if (isPending && !data?.user) {
        return null;
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    className="flex rounded-lg border border-border/10 p-3 w-full flex-items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2">
                    {data?.user?.image ? (
                        <Avatar className="">
                            <AvatarImage
                                src={data.user.image}
                                alt="User Avatar"
                                className="rounded-full w-8 h-8 object-cover object-left"
                            />
                        </Avatar>
                    ) : (
                        <GenerateAvatar
                            seed={data?.user?.name}
                            variant="initials"
                            className="size-9 mr-3"
                        />
                    )}
                    <div className="flex flex-col justify-center min-w-0 flex-1 overflow-hidden text-left">
                        <p className="text-sm font-medium truncate leading-tight">{data?.user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{data?.user?.email}</p>
                    </div>
                    <IoIosArrowDown className="size-4 shrink-0 cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="right" className="w-72">
                    <DropdownMenuLabel>
                        <div className="flex flex-col gap-1">
                            <span className="font-medium truncate">
                                {data?.user?.name}
                            </span>
                            <span className="text-sm font-normal text-muted-foreground truncate">{data?.user?.email}</span>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer flex items-center justify-between">
                        Billing
                        <PiCreditCardFill className="size-4" />
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onLogout} className="cursor-pointer flex items-center justify-between">
                        Logout
                        <TbLogout className="size-4" />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default DashboardUserButton;
