import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileTabProps {
  userInfo: {
    name: string;
    email: string;
    location: string;
    phone: string;
  };
}

export function ProfileTab({ userInfo }: ProfileTabProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-semibold">Profile Information</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Update your personal information and public profile
          </p>
        </div>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div>
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <Input defaultValue={userInfo.name} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <Input defaultValue={userInfo.email} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <Input defaultValue={userInfo.phone} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Location</label>
          <Input defaultValue={userInfo.location} className="mt-1" />
        </div>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
