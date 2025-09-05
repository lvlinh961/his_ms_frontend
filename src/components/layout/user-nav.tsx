"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import authApiRequest from "@/components/auth/authApiRequest";
import { toast } from "@/components/ui/use-toast";
import { useAppContext } from "@/providers/app-proviceders";

export function UserNav() {
  const session = {
    user: {
      name: "Admin",
      email: "admin@mail.com",
      image: "",
    },
  };

  const { user } = useAppContext();

  const LogoutButton = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleLogout = async () => {
      const sessionToken = searchParams.get("token");
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        await authApiRequest.logoutFromNextClientToNextServer(true, signal);
        localStorage.removeItem("sessionToken");
        localStorage.removeItem("sessionTokenExpiresAt");
        router.push(`/login?redirectFrom=${pathname}`);
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Lỗi không xác định",
          variant: "destructive",
          duration: 3000,
        });
      }
    };

    return (
      <DropdownMenuItem onClick={() => handleLogout()}>
        Đăng xuất
        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
      </DropdownMenuItem>
    );
  };

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full ">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={session.user?.image ?? ""}
                alt={session.user?.name ?? ""}
              />
              <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.firstName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {`${user?.id}`}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* <DropdownMenuGroup>
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>New Team</DropdownMenuItem>
          </DropdownMenuGroup> */}
          {/* <DropdownMenuSeparator /> */}
          <LogoutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
