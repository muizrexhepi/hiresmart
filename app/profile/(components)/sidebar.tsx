import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Heart,
  Settings,
  LogOut,
  BriefcaseIcon,
  MapPin,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userInfo: {
    name: string;
    email: string;
    location: string;
    phone: string;
    joinDate: string;
    avatarUrl: string;
  };
}

export function Sidebar({ activeTab, setActiveTab, userInfo }: SidebarProps) {
  return (
    <div className="md:w-1/3 border-r bg-gray-50/50">
      <div className="p-6 border-b bg-white rounded-t-3xl">
        <div className="flex flex-col items-center text-center mb-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={userInfo.avatarUrl} alt={userInfo.name} />
            <AvatarFallback className="text-xl">
              {userInfo.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">{userInfo.name}</h2>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {userInfo.location}
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Mail className="h-4 w-4 mr-2" />
            {userInfo.email}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Phone className="h-4 w-4 mr-2" />
            {userInfo.phone}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            Member since {userInfo.joinDate}
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-1">
        <Button
          variant={activeTab === "profile" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("profile")}
        >
          <User className="mr-2 h-4 w-4" />
          Profile
        </Button>
        <Button
          variant={activeTab === "services" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("services")}
        >
          <BriefcaseIcon className="mr-2 h-4 w-4" />
          My Services
        </Button>
        <Button
          variant={activeTab === "saved" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("saved")}
        >
          <Heart className="mr-2 h-4 w-4" />
          Saved Items
        </Button>
        <Button
          variant={activeTab === "settings" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Separator className="my-4" />
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </nav>
    </div>
  );
}
