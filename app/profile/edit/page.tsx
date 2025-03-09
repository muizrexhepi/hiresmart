"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import {
  account,
  storage,
  Buckets,
  appwriteConfig,
  databases,
} from "@/lib/appwrite";
import { ID } from "appwrite";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { updateUser } from "@/app/actions/users"; // Import the updateUser function

export default function EditProfilePage() {
  const router = useRouter();
  const { user, isLoading: loading, refresh } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    avatar: "/assets/icons/placeholder.svg?height=100&width=100",
    memberSince: "",
  });

  // Load user data when available
  useEffect(() => {
    if (user && !loading) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.prefs?.location || "",
        bio: user.prefs?.bio || "",
        avatar: user.prefs?.avatar || "/placeholder.svg?height=100&width=100",
        memberSince: user.prefs?.memberSince || new Date().toLocaleDateString(),
      });

      // Try to fetch additional user data from users collection
      const fetchUserData = async () => {
        try {
          const response = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            user.$id
          );

          // Update form data with any additional fields from the collection
          setFormData((prev) => ({
            ...prev,
            name: prev.name || response.name,
            avatar: prev.avatar || response.image,
            memberSince: response.memberSince || prev.memberSince,
          }));
        } catch (error) {
          console.error("Error fetching user data from collection:", error);
          // If the user doesn't exist in the collection yet, that's ok
        }
      };

      fetchUserData();
    }
  }, [user, loading]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      // Update name in the account
      if (user.name !== formData.name) {
        await account.updateName(formData.name);
      }

      // Update phone if changed and not empty
      if (user.phone !== formData.phone && formData.phone) {
        try {
          await account.updatePhone(formData.phone, "12345678");
        } catch (phoneError) {
          console.error("Phone update error:", phoneError);
          toast("Phone update failed", {
            description: "There was an error updating your phone number.",
          });
        }
      }

      // Update account preferences
      const prefs = {
        ...(user.prefs || {}),
        location: formData.location,
        bio: formData.bio,
        avatar: formData.avatar || user.prefs?.avatar,
        memberSince: formData.memberSince || new Date().toLocaleDateString(),
      };

      await account.updatePrefs(prefs);

      // Now update the user collection document
      try {
        await updateUser(user.$id, {
          name: formData.name,
          image:
            formData.avatar ||
            "/assets/icons/placeholder.svg?height=48&width=48",
          memberSince: formData.memberSince || new Date().toLocaleDateString(),
          location: formData.location, // Add location
          phone: formData.phone, // Add phone number
        });
      } catch (userUpdateError) {
        console.error("Error updating user collection:", userUpdateError);
        toast("Collection update failed", {
          description:
            "Your profile was updated but there was an error updating your public profile.",
        });
      }

      toast("Profile updated", {
        description: "Your profile has been successfully updated.",
      });

      router.push("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast("Update failed", {
        description:
          "There was an error updating your profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
      await refresh();
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    setIsLoading(true);

    try {
      // Upload file to Appwrite Storage
      const fileUpload = await storage.createFile(
        Buckets.AVATARS,
        ID.unique(),
        file
      );

      // Get file preview URL
      const fileUrl = storage
        .getFilePreview(Buckets.AVATARS, fileUpload.$id)
        .toString();

      // Update avatar in form data
      setFormData((prev) => ({ ...prev, avatar: fileUrl }));

      // Update user prefs with new avatar
      if (user) {
        const prefs = {
          ...(user.prefs || {}),
          avatar: fileUrl,
        };
        await account.updatePrefs(prefs);

        // Also update the user collection
        try {
          await updateUser(user.$id, {
            image: fileUrl,
          });
        } catch (userUpdateError) {
          console.error(
            "Error updating user image in collection:",
            userUpdateError
          );
        }
      }

      toast("Avatar updated", {
        description: "Your profile picture has been updated.",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast("Upload failed", {
        description:
          "There was an error uploading your avatar. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push("/profile")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Profile
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>
              Update your personal information and profile settings
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
                  <AvatarImage src={formData.avatar} alt={formData.name} />
                  <AvatarFallback>
                    {formData.name
                      ? formData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="relative">
                  <input
                    type="file"
                    id="avatar-upload"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={isLoading}
                  />
                  <label htmlFor="avatar-upload">
                    <Button
                      variant="outline"
                      type="button"
                      className="text-sm"
                      asChild
                    >
                      <span>
                        <Upload className="h-4 w-4 mr-2" /> Change Photo
                      </span>
                    </Button>
                  </label>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled // Email updates require verification, so disable this field
                />
                <p className="text-xs text-muted-foreground">
                  Email changes require verification and cannot be updated
                  directly.
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell others about yourself..."
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/profile")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin size-5" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
