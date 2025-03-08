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
import { ArrowLeft, ImagePlus, Loader2, X } from "lucide-react";
import { ID } from "appwrite";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { appwriteConfig, storage } from "@/lib/appwrite";
import { LOCATIONS } from "@/constants/locations";
import { getListingById, updateListing } from "@/app/actions/listings";
import { Listing } from "@/lib/types";

interface EditListingPageProps {
  params: {
    id: string;
  };
}

export default function EditListingPage({ params }: EditListingPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fileUploads, setFileUploads] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
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
      router.push("/");
      return;
    }

    // Fetch the existing listing
    const fetchListing = async () => {
      try {
        const listing = await getListingById(params.id);
        console.log({ listing });
        if (!listing) {
          toast("Error", {
            description: "Listing not found.",
          });
          router.push("/profile");
          return;
        }

        // Check if the current user is the owner of the listing
        if (listing.userId !== user.$id) {
          toast("Access Denied", {
            description: "You don't have permission to edit this listing.",
          });
          router.push("/profile");
          return;
        }

        // Populate form data
        setFormData({
          title: listing.title || "",
          category: listing.category || "",
          subcategory: listing.subcategory || "",
          price: listing.price?.toString() || "",
          location: listing.location || "",
          description: listing.description || "",
          condition: listing.condition || "",
          brand: listing.brand || "",
          model: listing.model || "",
          year: listing.year || "",
          warranty: listing.warranty || "",
        });

        // Set existing images
        setExistingImages(listing.images || []);
        setFilePreviews(listing.images || []);
      } catch (error) {
        console.error("Error fetching listing:", error);
        toast("Error", {
          description: "Failed to load listing data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [user, router, params.id]);

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
    // Check if it's an existing image or a new upload
    const isExistingImage = index < existingImages.length;

    if (isExistingImage) {
      // Remove from existing images
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Remove from new uploads (adjust index for fileUploads array)
      const adjustedIndex = index - existingImages.length;
      setFileUploads((prev) => prev.filter((_, i) => i !== adjustedIndex));
    }

    // Remove from previews
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
        description: "You must be logged in to update a listing",
      });
      return;
    }

    setIsSaving(true);

    try {
      // 1. Upload new images if present
      const newImageUrls =
        fileUploads.length > 0 ? await uploadImages(fileUploads) : [];

      // 2. Combine existing and new images
      const allImages = [...existingImages, ...newImageUrls];

      // 3. Update listing
      const listingData: Partial<Listing> = {
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
        images: allImages,
      };

      const updatedListing = await updateListing(params.id, listingData);

      if (updatedListing) {
        toast("Success!", {
          description: "Your listing has been updated",
        });
        router.push("/profile");
      } else {
        throw new Error("Failed to update listing");
      }
    } catch (error) {
      console.error("Error updating listing:", error);
      toast("Error", {
        description: "Failed to update listing. Please try again.",
      });
    } finally {
      setIsSaving(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
            <CardTitle>Edit Listing</CardTitle>
            <CardDescription>
              Update your listing information and details
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
                    <SelectItem value="vehicles">Vehicles</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="sports">Sports & Recreation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
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
