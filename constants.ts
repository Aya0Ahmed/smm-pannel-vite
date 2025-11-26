import { SMMService, ServiceType } from './types';

export const MOCK_SERVICES: SMMService[] = [
  // Instagram
  { id: 101, platform: ServiceType.INSTAGRAM, name: "Instagram Followers [Real High Quality]", rate: 2.50, min: 10, max: 50000, category: "Followers" },
  { id: 102, platform: ServiceType.INSTAGRAM, name: "Instagram Likes [Instant]", rate: 0.40, min: 50, max: 10000, category: "Likes" },
  { id: 103, platform: ServiceType.INSTAGRAM, name: "Instagram Views [Reels]", rate: 0.05, min: 100, max: 1000000, category: "Views" },
  
  // TikTok
  { id: 201, platform: ServiceType.TIKTOK, name: "TikTok Followers [Fast]", rate: 4.00, min: 100, max: 20000, category: "Followers" },
  { id: 202, platform: ServiceType.TIKTOK, name: "TikTok Views [Instant Start]", rate: 0.02, min: 1000, max: 10000000, category: "Views" },
  { id: 203, platform: ServiceType.TIKTOK, name: "TikTok Likes", rate: 1.50, min: 50, max: 50000, category: "Likes" },

  // YouTube
  { id: 301, platform: ServiceType.YOUTUBE, name: "YouTube Subscribers [Non-Drop]", rate: 25.00, min: 50, max: 2000, category: "Subscribers" },
  { id: 302, platform: ServiceType.YOUTUBE, name: "YouTube Views [High Retention]", rate: 3.50, min: 1000, max: 100000, category: "Views" },

  // Twitter
  { id: 401, platform: ServiceType.TWITTER, name: "Twitter/X Followers", rate: 8.00, min: 100, max: 10000, category: "Followers" },
];

export const PAYMENT_METHODS = [
  { id: 'stripe', name: 'Credit/Debit Card', fee: '2.5%', icon: 'CreditCard' },
  { id: 'egypt_wallet', name: 'Egyptian Wallets (Vodafone/Etisalat/InstaPay)', fee: '0%', icon: 'Smartphone' },
  { id: 'crypto', name: 'Cryptocurrency (BTC/ETH/USDT)', fee: '0%', icon: 'Bitcoin' },
  { id: 'paypal', name: 'PayPal', fee: '5%', icon: 'Wallet' },
];