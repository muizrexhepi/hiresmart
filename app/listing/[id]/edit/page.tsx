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
import { CATEGORIES } from "@/constants/categories";

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
    // Added vehicle-specific fields
    mileage: "",
    gearbox: "",
    fuel: "",
    engineSize: "",
    color: "",
    doors: "",
    seats: "",
    driveType: "",
    bodyType: "",
    features: "",
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
          // Populate vehicle-specific fields
          mileage: listing.mileage || "",
          gearbox: listing.gearbox || "",
          fuel: listing.fuel || "",
          engineSize: listing.engineSize || "",
          color: listing.color || "",
          doors: listing.doors || "",
          seats: listing.seats || "",
          driveType: listing.driveType || "",
          bodyType: listing.bodyType || "",
          features: listing.features || "",
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
        // Include vehicle-specific fields when applicable
        ...(formData.category === "vehicles" && {
          mileage: formData.mileage || undefined,
          gearbox: formData.gearbox || undefined,
          fuel: formData.fuel || undefined,
          engineSize: formData.engineSize || undefined,
          color: formData.color || undefined,
          doors: formData.doors || undefined,
          seats: formData.seats || undefined,
          driveType: formData.driveType || undefined,
          bodyType: formData.bodyType || undefined,
          features: formData.features || undefined,
        }),
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

  // Check if we should show vehicle-specific fields
  const isVehicleCategory = formData.category === "vehicles";

  // Helper function to determine if vehicle subcategory is a motor vehicle (car, motorcycle, truck)
  const isMotorVehicle = () => {
    const motorVehicleTypes = ["cars", "motorcycles", "trucks"];
    return (
      isVehicleCategory &&
      (motorVehicleTypes.includes(formData.subcategory.toLowerCase()) ||
        !formData.subcategory)
    );
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

              {/* Vehicle-specific fields - Only show for vehicle category */}
              {isVehicleCategory && (
                <>
                  <div className="border-t pt-6 mt-6">
                    <h3 className="font-semibold text-lg mb-4">
                      Vehicle Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Brand and Model */}
                      {/* Brand and Model */}
                      <div className="space-y-2">
                        <Label htmlFor="brand">Make/Brand</Label>
                        <Input
                          id="brand"
                          name="brand"
                          value={formData.brand}
                          onChange={handleChange}
                          placeholder="e.g., Toyota, Honda"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="model">Model</Label>
                        <Input
                          id="model"
                          name="model"
                          value={formData.model}
                          onChange={handleChange}
                          placeholder="e.g., Camry, Civic"
                        />
                      </div>

                      {/* Year and Condition */}
                      <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input
                          id="year"
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          placeholder="e.g., 2019"
                        />
                      </div>

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
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="salvage">Salvage</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Mileage and Color */}
                      {isMotorVehicle() && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="mileage">Mileage</Label>
                            <Input
                              id="mileage"
                              name="mileage"
                              value={formData.mileage}
                              onChange={handleChange}
                              placeholder="e.g., 45000"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="color">Color</Label>
                            <Input
                              id="color"
                              name="color"
                              value={formData.color}
                              onChange={handleChange}
                              placeholder="e.g., Black, Silver"
                            />
                          </div>
                        </>
                      )}

                      {/* Engine and Transmission */}
                      {isMotorVehicle() && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="engineSize">Engine Size</Label>
                            <Input
                              id="engineSize"
                              name="engineSize"
                              value={formData.engineSize}
                              onChange={handleChange}
                              placeholder="e.g., 2.5L, 3.0L"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="gearbox">Transmission</Label>
                            <Select
                              onValueChange={(value) =>
                                handleSelectChange("gearbox", value)
                              }
                              value={formData.gearbox}
                            >
                              <SelectTrigger id="gearbox">
                                <SelectValue placeholder="Select transmission" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="automatic">
                                  Automatic
                                </SelectItem>
                                <SelectItem value="manual">Manual</SelectItem>
                                <SelectItem value="semi-automatic">
                                  Semi-Automatic
                                </SelectItem>
                                <SelectItem value="cvt">CVT</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}

                      {/* Fuel Type and Body Type */}
                      {isMotorVehicle() && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="fuel">Fuel Type</Label>
                            <Select
                              onValueChange={(value) =>
                                handleSelectChange("fuel", value)
                              }
                              value={formData.fuel}
                            >
                              <SelectTrigger id="fuel">
                                <SelectValue placeholder="Select fuel type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="petrol">Petrol</SelectItem>
                                <SelectItem value="diesel">Diesel</SelectItem>
                                <SelectItem value="electric">
                                  Electric
                                </SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bodyType">Body Type</Label>
                            <Select
                              onValueChange={(value) =>
                                handleSelectChange("bodyType", value)
                              }
                              value={formData.bodyType}
                            >
                              <SelectTrigger id="bodyType">
                                <SelectValue placeholder="Select body type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sedan">Sedan</SelectItem>
                                <SelectItem value="suv">SUV</SelectItem>
                                <SelectItem value="hatchback">
                                  Hatchback
                                </SelectItem>
                                <SelectItem value="coupe">Coupe</SelectItem>
                                <SelectItem value="convertible">
                                  Convertible
                                </SelectItem>
                                <SelectItem value="wagon">Wagon</SelectItem>
                                <SelectItem value="pickup">Pickup</SelectItem>
                                <SelectItem value="van">Van</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}

                      {/* Doors and Seats */}
                      {isMotorVehicle() && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="doors">Doors</Label>
                            <Select
                              onValueChange={(value) =>
                                handleSelectChange("doors", value)
                              }
                              value={formData.doors}
                            >
                              <SelectTrigger id="doors">
                                <SelectValue placeholder="Select number of doors" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="seats">Seats</Label>
                            <Select
                              onValueChange={(value) =>
                                handleSelectChange("seats", value)
                              }
                              value={formData.seats}
                            >
                              <SelectTrigger id="seats">
                                <SelectValue placeholder="Select number of seats" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="6">6</SelectItem>
                                <SelectItem value="7">7+</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}

                      {/* Drive Type and Warranty */}
                      {isMotorVehicle() && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="driveType">Drive Type</Label>
                            <Select
                              onValueChange={(value) =>
                                handleSelectChange("driveType", value)
                              }
                              value={formData.driveType}
                            >
                              <SelectTrigger id="driveType">
                                <SelectValue placeholder="Select drive type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fwd">FWD</SelectItem>
                                <SelectItem value="rwd">RWD</SelectItem>
                                <SelectItem value="awd">AWD</SelectItem>
                                <SelectItem value="4wd">4WD</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="warranty">Warranty</Label>
                            <Input
                              id="warranty"
                              name="warranty"
                              value={formData.warranty}
                              onChange={handleChange}
                              placeholder="e.g., 3 months, 1 year remaining"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Provide a detailed description of your item or service"
                      rows={5}
                      required
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label>Images</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {filePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <label className="flex items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      multiple
                    />
                    <div className="flex flex-col items-center space-y-2">
                      <ImagePlus className="w-8 h-8 text-gray-400" />
                      <span className="text-xs text-gray-500">Add Image</span>
                    </div>
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  You can upload up to 10 images. First image will be the cover
                  image.
                </p>
              </div>
              {/* Features */}
              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label htmlFor="features">Features</Label>
                <Textarea
                  id="features"
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  placeholder="List notable features, e.g., leather seats, sunroof, navigation system"
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
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
