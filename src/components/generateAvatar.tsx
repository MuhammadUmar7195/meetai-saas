"use client";

import {useMemo} from "react";
import {createAvatar} from '@dicebear/core';
import {botttsNeutral, initials} from '@dicebear/collection';
import {cn} from '@/lib/utils';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';

interface generatedAvatarProps {
    seed: string | undefined;
    className?: string;
    variant: "botttsNeutral" | "initials";
}

export const GenerateAvatar = ({seed, className, variant}: generatedAvatarProps) => {
    const avatarUri = useMemo(() => {
        if (!seed) return undefined;
        let avatar;
        if (variant === "botttsNeutral") {
            avatar = createAvatar(botttsNeutral, {seed});
        } else if (variant === "initials") {
            avatar = createAvatar(initials, {seed, fontWeight: 500, fontSize: 42});
        }
        return avatar?.toDataUri();
    }, [seed, variant]);

    return (
        <Avatar className={cn(className)}>
            {avatarUri && (
                <AvatarImage src={avatarUri} alt="Avatar"/>
            )}
            <AvatarFallback>
                {seed?.charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    );
};