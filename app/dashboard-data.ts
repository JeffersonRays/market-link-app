import { farmers, markets, products } from "./data";

export type DashboardStatus = "Placed" | "Accepted" | "Ready for Pickup" | "Completed" | "Cancelled" | "Declined" | "Pending" | "Approved" | "Rejected" | "Suspended" | "Available" | "Low Stock" | "Sold Out" | "Unavailable";

export const customerOrders = [
  { id: "ML-1048", farmer: "Green Acre Farms", farmerInitials: "GA", market: "Lekki Farmers Market", items: "Tomatoes, butter lettuce + 2 more", amount: "₦8,400", date: "Saturday, 18 May", time: "10:30 AM", status: "Ready for Pickup" as DashboardStatus },
  { id: "ML-1053", farmer: "The Bread Table", farmerInitials: "BT", market: "Lekki Farmers Market", items: "Country sourdough + granola", amount: "₦6,200", date: "Saturday, 18 May", time: "11:15 AM", status: "Accepted" as DashboardStatus },
  { id: "ML-1061", farmer: "Sunrise Orchards", farmerInitials: "SO", market: "Yaba Fresh Market", items: "Strawberries + mangoes", amount: "₦5,700", date: "Wednesday, 22 May", time: "8:45 AM", status: "Placed" as DashboardStatus },
];

export const customerNotifications = [
  { title: "Your order is ready for pickup", text: "ML-1048 · Green Acre Farms", time: "12 min ago", tone: "green" },
  { title: "Your order has been accepted", text: "The Bread Table will have your order ready Saturday.", time: "Yesterday", tone: "orange" },
  { title: "Saturday market opens at 8 AM", text: "Lekki Farmers Market is looking good this week.", time: "2 days ago", tone: "soft" },
];

export const farmerOrders = [
  { customer: "Ada Nwosu", initials: "AN", id: "ML-1048", pickup: "10:30 AM", items: 6, status: "Ready for Pickup" as DashboardStatus },
  { customer: "Daniel Okafor", initials: "DO", id: "ML-1053", pickup: "11:15 AM", items: 3, status: "Accepted" as DashboardStatus },
  { customer: "Mariam Bello", initials: "MB", id: "ML-1066", pickup: "12:00 PM", items: 8, status: "Placed" as DashboardStatus },
  { customer: "Tobi Akin", initials: "TA", id: "ML-1071", pickup: "1:30 PM", items: 4, status: "Accepted" as DashboardStatus },
];

export const inventory = [
  { name: "Vine-ripened tomatoes", stock: 40, reserved: 12, sold: 8, available: 20, status: "Available" as DashboardStatus, accent: "#73a942" },
  { name: "Butter lettuce", stock: 28, reserved: 16, sold: 8, available: 4, status: "Low Stock" as DashboardStatus, accent: "#e58b3a" },
  { name: "Fresh basil", stock: 18, reserved: 4, sold: 14, available: 0, status: "Sold Out" as DashboardStatus, accent: "#bc6b54" },
  { name: "Spring onions", stock: 34, reserved: 8, sold: 10, available: 16, status: "Available" as DashboardStatus, accent: "#73a942" },
];

export const farmerReviews = [
  { name: "Ada Nwosu", initials: "AN", rating: 5, text: "The tomatoes were bright, juicy and still warm from the morning harvest. Will definitely reserve again.", date: "2 days ago" },
  { name: "Kemi Adebayo", initials: "KA", rating: 5, text: "Everything was packed with care and pickup was so easy. Love knowing where our food comes from.", date: "1 week ago" },
];

export const adminApprovals = [
  { name: "Meadow Harvest", owner: "Chidi Eze", email: "chidi@meadowharvest.ng", joined: "18 May 2025", category: "Vegetables", initials: "MH", accent: "#e9e5c9" },
  { name: "Ola's Pantry", owner: "Olamide Akin", email: "hello@olaspantry.ng", joined: "17 May 2025", category: "Baked goods", initials: "OP", accent: "#f5ddbf" },
  { name: "Coastal Honey Co.", owner: "Nneka Obi", email: "nneka@coastalhoney.ng", joined: "15 May 2025", category: "Pantry", initials: "CH", accent: "#f2edbf" },
];

export const platformOrders = [
  { id: "ML-1072", customer: "Seyi Martins", farmer: "Green Acre Farms", market: "Lekki Farmers Market", amount: "₦4,800", status: "Accepted" as DashboardStatus },
  { id: "ML-1071", customer: "Tobi Akin", farmer: "Green Acre Farms", market: "Lekki Farmers Market", amount: "₦7,200", status: "Ready for Pickup" as DashboardStatus },
  { id: "ML-1070", customer: "Nneka Obi", farmer: "Sunrise Orchards", market: "Yaba Fresh Market", amount: "₦5,700", status: "Completed" as DashboardStatus },
  { id: "ML-1069", customer: "Kemi Adebayo", farmer: "The Bread Table", market: "VI Green Market", amount: "₦3,500", status: "Placed" as DashboardStatus },
];

export const marketActivity = markets.slice(0, 3).map((market, index) => ({ ...market, activeFarmers: [42, 31, 26][index], weeklyOrders: [186, 124, 88][index], status: index === 2 ? "Quiet this week" : "Active" }));

export const adminReviews = [
  { name: "Tola Ajayi", context: "Sunrise Orchards · Yaba Fresh Market", text: "Lovely fruit, but the pickup window was confusing.", flag: "Needs reply", rating: 3 },
  { name: "Seyi Martins", context: "Green Acre Farms · Lekki Farmers Market", text: "The best tomatoes I have found in Lagos. Fresh and friendly.", flag: "Published", rating: 5 },
];

export const registrations = [
  { name: "Meadow Harvest", type: "Farmer", detail: "Vegetables · Lekki", time: "12 min ago", initials: "MH", accent: "#e9e5c9" },
  { name: "Bisi Adewale", type: "Customer", detail: "Lagos Island", time: "34 min ago", initials: "BA", accent: "#d9e9de" },
  { name: "Ola's Pantry", type: "Farmer", detail: "Baked goods · Yaba", time: "1 hr ago", initials: "OP", accent: "#f5ddbf" },
];

export const dashboardData = { farmers, markets, products };
