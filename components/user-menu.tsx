import React from "react";
import Link from "next/link";
import {
  User,
  Settings,
  LogOut,
  UserCircle,
  Heart,
  BriefcaseIcon,
  Menu,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authHelper } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { useAuth } from "./providers/auth-provider";

export function UserMenu({ user }: any) {
  const router = useRouter();
  const { refresh } = useAuth();

  const handleSignOut = async () => {
    try {
      await authHelper.signOut();
      await refresh();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          className="relative rounded-full bg-transparent border transition-colors px-3"
        >
          <Menu color="black" size={30} />
          <Avatar className="size-6">
            <AvatarImage src={user?.avatarUrl} alt={user?.name} />
            <AvatarFallback>
              <UserCircle className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex cursor-pointer items-center">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/my-services"
              className="flex cursor-pointer items-center"
            >
              <BriefcaseIcon className="mr-2 h-4 w-4" />
              My Services
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/saved" className="flex cursor-pointer items-center">
              <Heart className="mr-2 h-4 w-4" />
              Saved Items
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex cursor-pointer items-center">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
