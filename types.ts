import { LucideIcon } from "lucide-react";

export enum ServiceType {
  INSTAGRAM = 'Instagram',
  TIKTOK = 'TikTok',
  YOUTUBE = 'YouTube',
  TWITTER = 'Twitter',
  FACEBOOK = 'Facebook'
}

export interface SMMService {
  id: number;
  platform: ServiceType;
  name: string;
  rate: number; // Price per 1000
  min: number;
  max: number;
  category: string;
  source?: string; // 'Manual' or API URL
}

export interface Order {
  id: string;
  serviceId: number;
  serviceName: string;
  link: string;
  quantity: number;
  charge: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Canceled';
  date: string;
}

export interface TicketMessage {
  sender: 'user' | 'admin';
  text: string;
  date: string;
}

export interface Ticket {
  id: string;
  subject: string;
  orderId?: string; // Optional
  status: 'Open' | 'Answered' | 'Closed';
  lastUpdated: string;
  messages: TicketMessage[];
  userId?: string; // To link ticket to specific user in DB
}

export interface UserDatabaseProfile {
    id: string;
    name: string;
    email: string;
    balance: number;
    spent: number;
    role: 'user' | 'admin';
    orders: Order[];
    tickets: Ticket[];
}

export interface UserState {
  balance: number;
  spent: number;
  orders: Order[];
  tickets: Ticket[];
  services: SMMService[];
  // Simulating a database of all users for Admin to search
  allUsers: UserDatabaseProfile[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type Language = 'en' | 'ar';

export interface UserProfile {
  uid: string;
  name: string;
  email?: string;        // ← خليتها اختياري
  role: 'admin' | 'user';
  balance?: number;
  spent?: number;
  orders?: any[];
  tickets?: any[];
}

export interface UserState {
  name: string;
  spent: number;
  orders: Order[];
}

export interface UserContextType {
  state: UserState;
  dispatch: React.Dispatch<any>;
}
export interface Service{
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  price: string;
  gradient: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  description: string;
  deliveryTime: string;
}

export interface ServiceItem {
  id: string;
  nameKey: string;
  rate: number;
  min: number;
  max: number;
  type: string;
  description?: string;

}

export interface PlatformCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  services: ServiceItem[];
}

// New Order Page Types
export interface ServiceOption {
  id: string;
  name: string;
  rate: number;
  min: number;
  max: number;
  description: string;
}

export interface CategoryOption {
  id: string;
  name: string; // e.g., "Views", "Followers"
  services: ServiceOption[];
}

export interface PlatformOption {
  id: string;
  name: string; // e.g., "TikTok", "Instagram"
  icon: LucideIcon;
  categories: CategoryOption[];
}