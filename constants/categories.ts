import {
  Car,
  Building2,
  Briefcase,
  Smartphone,
  Sofa,
  Bike,
  Wrench,
  ShoppingBag,
} from "lucide-react";

// Keep the mapping of string names to icon components
export const CATEGORY_ICONS = {
  vehicles: "Car",
  "real-estate": "Building2",
  jobs: "Briefcase",
  electronics: "Smartphone",
  "home-garden": "Sofa",
  sports: "Bike",
  tools: "Wrench",
  services: "ShoppingBag",
} as const;

// Create a direct mapping for easier access
export const ICON_COMPONENTS = {
  vehicles: Car,
  "real-estate": Building2,
  jobs: Briefcase,
  electronics: Smartphone,
  "home-garden": Sofa,
  sports: Bike,
  tools: Wrench,
  services: ShoppingBag,
};

export const CATEGORIES = [
  {
    id: "vehicles",
    title: "Vehicles",
    titleMk: "Возила",
    iconName: "vehicles",
    icon: Car, // Keep the direct icon reference
    color: "text-blue-500",
    subCategories: [
      { id: "cars", title: "Cars", titleMk: "Автомобили" },
      { id: "motorcycles", title: "Motorcycles", titleMk: "Мотори" },
      { id: "trucks", title: "Trucks", titleMk: "Камиони" },
      { id: "bicycles", title: "Bicycles", titleMk: "Велосипеди" },
      {
        id: "parts",
        title: "Parts & Accessories",
        titleMk: "Делови и Додатоци",
      },
    ],
  },
  {
    id: "real-estate",
    title: "Real Estate",
    titleMk: "Недвижности",
    iconName: "real-estate",
    icon: Building2,
    color: "text-orange-500",
    subCategories: [
      { id: "apartments", title: "Apartments", titleMk: "Станови" },
      { id: "houses", title: "Houses", titleMk: "Куќи" },
      { id: "land", title: "Land", titleMk: "Земјишта" },
      { id: "commercial", title: "Commercial", titleMk: "Деловни Простории" },
    ],
  },
  {
    id: "jobs",
    title: "Jobs",
    titleMk: "Работа",
    iconName: "jobs",
    icon: Briefcase,
    color: "text-green-500",
    subCategories: [
      { id: "full-time", title: "Full-time", titleMk: "Цела работна смена" },
      {
        id: "part-time",
        title: "Part-time",
        titleMk: "Скратено работно време",
      },
      { id: "freelance", title: "Freelance", titleMk: "Фриленс" },
      { id: "internship", title: "Internship", titleMk: "Практикантство" },
    ],
  },
  {
    id: "electronics",
    title: "Electronics",
    titleMk: "Електроника",
    iconName: "electronics",
    icon: Smartphone,
    color: "text-purple-500",
    subCategories: [
      { id: "phones", title: "Phones", titleMk: "Телефони" },
      { id: "laptops", title: "Laptops", titleMk: "Лаптопи" },
      { id: "cameras", title: "Cameras", titleMk: "Камери" },
      { id: "audio", title: "Audio", titleMk: "Аудио" },
    ],
  },
  {
    id: "home-garden",
    title: "Home & Garden",
    titleMk: "Дом и Градина",
    iconName: "home-garden",
    icon: Sofa,
    color: "text-yellow-500",
    subCategories: [
      { id: "furniture", title: "Furniture", titleMk: "Мебел" },
      { id: "appliances", title: "Appliances", titleMk: "Апарати" },
      { id: "garden", title: "Garden", titleMk: "Градина" },
      { id: "decor", title: "Home Decor", titleMk: "Декорација" },
    ],
  },
  {
    id: "sports",
    title: "Sports & Recreation",
    titleMk: "Спорт и Рекреација",
    iconName: "sports",
    icon: Bike,
    color: "text-red-500",
    subCategories: [
      { id: "gym", title: "Gym Equipment", titleMk: "Фитнес Опрема" },
      { id: "cycling", title: "Cycling", titleMk: "Велосипедизам" },
      { id: "outdoors", title: "Outdoor Activities", titleMk: "На Отворено" },
      { id: "water-sports", title: "Water Sports", titleMk: "Водени Спортови" },
    ],
  },
  {
    id: "tools",
    title: "Tools & Machinery",
    titleMk: "Алати и Машини",
    iconName: "tools",
    icon: Wrench,
    color: "text-zinc-500",
    subCategories: [
      { id: "hand-tools", title: "Hand Tools", titleMk: "Рачни Алати" },
      { id: "power-tools", title: "Power Tools", titleMk: "Електрични Алати" },
      {
        id: "industrial",
        title: "Industrial Equipment",
        titleMk: "Индустриска Опрема",
      },
    ],
  },
  {
    id: "services",
    title: "Services",
    titleMk: "Услуги",
    iconName: "services",
    icon: ShoppingBag,
    color: "text-indigo-500",
    subCategories: [
      { id: "home-repairs", title: "Home Repairs", titleMk: "Поправки на Дом" },
      { id: "moving", title: "Moving Services", titleMk: "Селидби" },
      { id: "cleaning", title: "Cleaning Services", titleMk: "Чистење" },
      { id: "personal", title: "Personal Services", titleMk: "Лични Услуги" },
    ],
  },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];
export type SubcategoryId =
  (typeof CATEGORIES)[number]["subCategories"][number]["id"];
