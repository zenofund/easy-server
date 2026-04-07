import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { getAvatarUrl, getInitials } from '../utils/avatarUtils';
import { cn } from './ui/utils';

interface UserAvatarProps {
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  className?: string;
  fallbackClassName?: string;
  size?: number | string;
}

export function UserAvatar({ 
  firstName, 
  lastName, 
  avatar, 
  className, 
  fallbackClassName,
  size 
}: UserAvatarProps) {
  const avatarUrl = getAvatarUrl(avatar);
  const initials = getInitials(firstName, lastName);

  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <Avatar className={cn(className)} style={sizeStyle}>
      {avatarUrl && (
        <AvatarImage 
          src={avatarUrl} 
          alt={firstName || 'User'} 
          className="object-cover"
        />
      )}
      <AvatarFallback className={cn("bg-[#CCDED6] text-[#005C32] font-lexend font-medium", fallbackClassName)}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
