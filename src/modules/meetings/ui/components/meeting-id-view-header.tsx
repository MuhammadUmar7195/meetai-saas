import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronRightIcon, MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import Link from "next/link";

interface MeetingIdViewHeaderProps {
    meetingId: string;
    meetingName: string;
    onEdit: () => void;
    onRemove: () => void;
}

export default function MeetingIdViewHeader({ meetingId, meetingName, onEdit, onRemove }: MeetingIdViewHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            {/* List of path of current agents */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild className="font-medium text-xl">
                            <Link href={`/meetings`}>My Meetings</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-foreground text-xl font-medium [&>svg]:size-4">
                        <ChevronRightIcon />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild className="font-medium text-xl text-foreground">
                            <Link href={`/meetings/${meetingId}`}>
                                {meetingName.length >= 20 ? meetingName.slice(0, 20) + "..." : meetingName}
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <DropdownMenu modal={true}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <MoreVerticalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                        <PencilIcon className="size-4 text-black" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onRemove} className="cursor-pointer">
                        <TrashIcon className="size-4 text-black" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
