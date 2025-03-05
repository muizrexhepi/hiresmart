import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Shield, Mail, Smartphone, Globe, Moon } from "lucide-react";

export function SettingsTab() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [privacy, setPrivacy] = useState("friends");

  const settingSections = [
    {
      id: "notifications",
      title: "Notification Settings",
      description: "Control how you receive notifications",
      icon: Bell,
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Push Notifications</p>
            <p className="text-sm text-muted-foreground">
              Receive notifications about your account activity
            </p>
          </div>
          <Button
            variant={notifications ? "default" : "outline"}
            onClick={() => setNotifications(!notifications)}
          >
            {notifications ? "Enabled" : "Disabled"}
          </Button>
        </div>
      ),
    },
    {
      id: "privacy",
      title: "Privacy Settings",
      description: "Manage your privacy preferences",
      icon: Shield,
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Profile Visibility</p>
            <p className="text-sm text-muted-foreground">
              Control who can see your profile
            </p>
          </div>
          <div className="flex gap-2">
            {["public", "friends", "private"].map((option) => (
              <Button
                key={option}
                variant={privacy === option ? "default" : "outline"}
                onClick={() => setPrivacy(option)}
                className="capitalize"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "appearance",
      title: "Appearance",
      description: "Customize your viewing experience",
      icon: Moon,
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Dark Mode</p>
            <p className="text-sm text-muted-foreground">
              Switch between light and dark theme
            </p>
          </div>
          <Button
            variant={darkMode ? "default" : "outline"}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Enabled" : "Disabled"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-semibold">Settings</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-4">
        {settingSections.map((section) => (
          <Card key={section.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <section.icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-semibold">{section.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>
              </div>
              {section.content}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}

export default SettingsTab;
