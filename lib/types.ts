export type ListingStatus = "active" | "pending" | "sold";

export interface Listing {
  $id: string;
  userId: string;
  title: string;
  price: number | null;
  location: string;
  status: ListingStatus;
  images: string[];
  category: string;
  subcategory?: string;
  description: string;
  condition?: string;
  brand?: string;
  model?: string;
  year?: string;
  warranty?: string;
  mileage?: string;
  gearbox?: string;
  fuel?: string;
  engineSize?: string;
  color?: string;
  doors?: string;
  seats?: string;
  driveType?: string;
  bodyType?: string;
  features?: string;
  createdAt: string;
  seller?: {
    id: string;
    name: string;
    image: string;
    memberSince: string;
    verified: boolean;
    rating: number;
    totalListings: number;
    responseRate: string;
    responseTime: string;
  };
  featured?: boolean;
}

export interface ListingsResponse {
  listings: Listing[];
  totalPages: number;
}

export interface ListingsParams {
  categoryId: string;
  subcategoryId?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  page?: number;
}

export interface Seller {
  id: string;
  name: string;
  phone?: string;
  image: string;
  memberSince: string;
  verified: boolean;
  rating: number;
  totalListings: number;
  responseRate: string;
  responseTime: string;
  location?: string;
  bio?: string;
  totalRatings: number;
}

export interface Rating {
  id: string;
  sellerId: string;
  raterId: string;
  value: number; // 1-5 stars
  comment?: string;
  createdAt: string;
}
