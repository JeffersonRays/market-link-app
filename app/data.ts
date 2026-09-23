export type Market = {
  slug: string;
  name: string;
  area: string;
  days: string;
  hours: string;
  farmers: number;
  open: boolean;
  image: string;
  description: string;
};

export type Farmer = {
  slug: string;
  name: string;
  initials: string;
  speciality: string;
  markets: string;
  rating: number;
  reviews: number;
  sellingToday: boolean;
  image: string;
  accent: string;
  bio: string;
};

export type Product = {
  slug: string;
  name: string;
  farmer: string;
  farmerSlug: string;
  market: string;
  price: string;
  unit: string;
  availability: string;
  status: "available" | "low" | "sold";
  sellingToday: boolean;
  image: string;
  category: string;
  description: string;
};

export const markets: Market[] = [
  {
    slug: "lekki-farmers-market",
    name: "Lekki Farmers Market",
    area: "Admiralty Way, Lekki Phase 1",
    days: "Saturdays",
    hours: "8:00 AM – 2:00 PM",
    farmers: 42,
    open: true,
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1000&q=85",
    description: "A bright Saturday gathering of growers, bakers and makers in the heart of Lekki.",
  },
  {
    slug: "yaba-fresh-market",
    name: "Yaba Fresh Market",
    area: "Herbert Macaulay Way, Yaba",
    days: "Wednesdays & Saturdays",
    hours: "7:00 AM – 1:00 PM",
    farmers: 31,
    open: true,
    image: "https://images.unsplash.com/photo-1488327761082-19d7c7f16aab?auto=format&fit=crop&w=1000&q=85",
    description: "Midweek and weekend produce runs, with trusted neighbourhood farmers and pantry staples.",
  },
  {
    slug: "victoria-island-green-market",
    name: "VI Green Market",
    area: "Eko Atlantic Boulevard",
    days: "Sundays",
    hours: "9:00 AM – 3:00 PM",
    farmers: 26,
    open: false,
    image: "https://images.unsplash.com/photo-1506484381205-f7947c9f9c78?auto=format&fit=crop&w=1000&q=85",
    description: "Slow Sunday shopping with seasonal fruit, flowers and small-batch local food.",
  },
  {
    slug: "ikeja-community-market",
    name: "Ikeja Community Market",
    area: "Allen Avenue, Ikeja",
    days: "Fridays",
    hours: "8:00 AM – 1:00 PM",
    farmers: 18,
    open: false,
    image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1000&q=85",
    description: "A friendly Friday market for quick, fresh groceries and familiar faces.",
  },
];

export const farmers: Farmer[] = [
  {
    slug: "green-acre-farms",
    name: "Green Acre Farms",
    initials: "GA",
    speciality: "Leafy greens & herbs",
    markets: "Lekki Farmers Market · VI Green Market",
    rating: 4.9,
    reviews: 38,
    sellingToday: true,
    image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=900&q=85",
    accent: "#dbead0",
    bio: "We grow crisp, chemical-free greens just outside Lagos and bring them to market within hours of harvest.",
  },
  {
    slug: "sunrise-orchards",
    name: "Sunrise Orchards",
    initials: "SO",
    speciality: "Seasonal fruit & preserves",
    markets: "Yaba Fresh Market",
    rating: 4.8,
    reviews: 24,
    sellingToday: true,
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=85",
    accent: "#f8e3bc",
    bio: "A family orchard bringing sun-ripened fruit, honest preserves and a little sweetness to your week.",
  },
  {
    slug: "root-and-rind",
    name: "Root & Rind",
    initials: "RR",
    speciality: "Root vegetables & eggs",
    markets: "Lekki Farmers Market · Ikeja Community Market",
    rating: 4.7,
    reviews: 19,
    sellingToday: false,
    image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=900&q=85",
    accent: "#ead9c5",
    bio: "Good soil, happy hens and a practical approach to feeding our neighbours well.",
  },
  {
    slug: "the-bread-table",
    name: "The Bread Table",
    initials: "BT",
    speciality: "Sourdough & pantry bakes",
    markets: "VI Green Market · Lekki Farmers Market",
    rating: 4.9,
    reviews: 46,
    sellingToday: true,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85",
    accent: "#f3dfc1",
    bio: "Long-fermented loaves, warm pastries and a belief that bread makes any market trip better.",
  },
];

export const products: Product[] = [
  { slug: "fresh-tomatoes", name: "Vine-ripened tomatoes", farmer: "Green Acre Farms", farmerSlug: "green-acre-farms", market: "Lekki Farmers Market", price: "₦1,800", unit: "per kg", availability: "12 kg left", status: "available", sellingToday: true, image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=85", category: "Vegetables", description: "Bright, juicy tomatoes picked at their peak for sauces, salads and everything in between." },
  { slug: "sweet-carrots", name: "Sweet young carrots", farmer: "Root & Rind", farmerSlug: "root-and-rind", market: "Lekki Farmers Market", price: "₦1,200", unit: "per bunch", availability: "8 bunches left", status: "low", sellingToday: false, image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=900&q=85", category: "Vegetables", description: "Tender, sweet young carrots with their tops on. Perfect for roasting or snacking." },
  { slug: "butter-lettuce", name: "Butter lettuce", farmer: "Green Acre Farms", farmerSlug: "green-acre-farms", market: "VI Green Market", price: "₦900", unit: "per head", availability: "20 heads left", status: "available", sellingToday: true, image: "https://images.unsplash.com/photo-1622205313162-be1d5712a43c?auto=format&fit=crop&w=900&q=85", category: "Leafy greens", description: "Soft, fresh leaves harvested this week. A lovely base for bright, crunchy salads." },
  { slug: "strawberries", name: "Punnets of strawberries", farmer: "Sunrise Orchards", farmerSlug: "sunrise-orchards", market: "Yaba Fresh Market", price: "₦2,500", unit: "per punnet", availability: "6 punnets left", status: "low", sellingToday: true, image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=85", category: "Fruit", description: "Small-batch strawberries with a deep berry flavour. Best enjoyed within a few days." },
  { slug: "free-range-eggs", name: "Free-range eggs", farmer: "Root & Rind", farmerSlug: "root-and-rind", market: "Ikeja Community Market", price: "₦2,200", unit: "per dozen", availability: "14 dozens left", status: "available", sellingToday: false, image: "https://images.unsplash.com/photo-1569288052389-dac9b01c9c9c?auto=format&fit=crop&w=900&q=85", category: "Pantry", description: "Rich-yolked eggs from happy hens, collected and packed for the week ahead." },
  { slug: "country-sourdough", name: "Country sourdough", farmer: "The Bread Table", farmerSlug: "the-bread-table", market: "Lekki Farmers Market", price: "₦3,500", unit: "per loaf", availability: "5 loaves left", status: "low", sellingToday: true, image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=900&q=85", category: "Bakery", description: "A deeply flavoured, long-fermented loaf with a crisp crust and soft, chewy crumb." },
];

export const getMarket = (slug: string) => markets.find((market) => market.slug === slug);
export const getFarmer = (slug: string) => farmers.find((farmer) => farmer.slug === slug);
export const getProduct = (slug: string) => products.find((product) => product.slug === slug);
