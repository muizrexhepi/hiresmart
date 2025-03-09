"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ImagePlus, Upload, Plus, X, Loader2 } from "lucide-react";
import { ID } from "appwrite";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { appwriteConfig, storage } from "@/lib/appwrite";
import { LOCATIONS } from "@/constants/locations";
import { createListing } from "@/app/actions/listings";
import { CATEGORIES } from "@/constants/categories";

export default function NewListingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [fileUploads, setFileUploads] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    price: "",
    location: "",
    description: "",
    condition: "",
    brand: "",
    model: "",
    year: "",
    warranty: "",
  });

  useEffect(() => {
    // Check if the user is authenticated
    if (!user) {
      router.push("/auth/login");
      return;
    }
  }, [user, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setFileUploads((prev) => [...prev, ...newFiles]);

      // Create preview URLs for new files
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFileUploads((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const imageUrls: string[] = [];

    for (const file of files) {
      try {
        const fileUploadResponse = await storage.createFile(
          appwriteConfig.storageId,
          ID.unique(),
          file
        );

        // Get the file URL
        const fileUrl = storage.getFileView(
          appwriteConfig.storageId,
          fileUploadResponse.$id
        );

        imageUrls.push(fileUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        // Continue with other images if one fails
      }
    }

    return imageUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast("Error", {
        description: "You must be logged in to create a listing",
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Upload images if present
      const imageUrls =
        fileUploads.length > 0 ? await uploadImages(fileUploads) : [];

      // 2. Create listing using our updated function
      const listingData = {
        userId: user.$id,
        title: formData.title,
        price: formData.price ? parseFloat(formData.price) : null,
        location: formData.location,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        description: formData.description,
        condition: formData.condition || undefined,
        brand: formData.brand || undefined,
        model: formData.model || undefined,
        year: formData.year || undefined,
        warranty: formData.warranty || undefined,
        images: imageUrls,
        status: "active" as const,
      };

      const newListing = await createListing(listingData);

      if (newListing) {
        toast("Success!", {
          description: "Your listing has been created",
        });
        router.push("/profile");
      } else {
        throw new Error("Failed to create listing");
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      toast("Error", {
        description: "Failed to create listing. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSubcategories = (category: string) => {
    const subcategories: Record<string, string[]> = {
      vehicles: [
        "Cars",
        "Motorcycles",
        "Trucks",
        "Boats",
        "Parts & Accessories",
      ],
      electronics: ["Phones", "Computers", "TVs", "Cameras", "Audio", "Gaming"],
      furniture: ["Living Room", "Bedroom", "Kitchen", "Office", "Outdoor"],
      services: ["Repair", "Cleaning", "Lessons", "Beauty", "Professional"],
      sports: [
        "Fitness",
        "Outdoor",
        "Team Sports",
        "Water Sports",
        "Winter Sports",
      ],
      other: ["Clothing", "Jewelry", "Art", "Books", "Collectibles"],
    };

    return subcategories[category] || [];
  };

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
            <CardTitle>Create New Listing</CardTitle>
            <CardDescription>
              Fill out the form below to create a new listing
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., 2019 Toyota Camry or Professional Photography Services"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                  value={formData.category}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subcategory - Only show if category is selected */}
              {formData.category && (
                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange("subcategory", value)
                    }
                    value={formData.subcategory}
                  >
                    <SelectTrigger id="subcategory">
                      <SelectValue placeholder="Select a subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubcategories(formData.category).map((sub) => (
                        <SelectItem key={sub} value={sub.toLowerCase()}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Leave empty for 'Contact for price'"
                    className="pl-8"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("location", value)
                  }
                  value={formData.location}
                  required
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {LOCATIONS.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Provide details about your listing..."
                  required
                />
              </div>

              {/* Condition - Optional */}
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("condition", value)
                  }
                  value={formData.condition}
                >
                  <SelectTrigger id="condition">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="like-new">Like New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Brand, Model, Year - Optional fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Brand name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="Model name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="Year"
                  />
                </div>
              </div>

              {/* Warranty - Optional */}
              <div className="space-y-2">
                <Label htmlFor="warranty">Warranty Information</Label>
                <Input
                  id="warranty"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleChange}
                  placeholder="e.g., 1 year manufacturer warranty"
                />
              </div>

              {/* Images */}
              <div className="space-y-4">
                <Label>Images</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {/* Preview uploaded images */}
                  {filePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="aspect-square border rounded-md overflow-hidden relative"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {/* Image upload input */}
                  {filePreviews.length < 6 && (
                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        multiple
                      />
                      <ImagePlus className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 text-center">
                        Add Image
                      </span>
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Upload up to 6 images for your listing (max 5MB each)
                </p>
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
                  "Create Listing"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
