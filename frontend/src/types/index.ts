export type SupportedLanguage = 'en' | 'nl' | 'de' | 'fr';

export interface NutritionalValues {
  energyKcal100g?: number;
  energyKcalServing?: number;
  fat100g?: number;
  fatServing?: number;
  saturatedFat100g?: number;
  saturatedFatServing?: number;
  carbohydrates100g?: number;
  carbohydratesServing?: number;
  sugars100g?: number;
  sugarsServing?: number;
  fiber100g?: number;
  fiberServing?: number;
  proteins100g?: number;
  proteinsServing?: number;
  salt100g?: number;
  saltServing?: number;
  sodium100g?: number;
  sodiumServing?: number;
}

export interface Product {
  code: string;
  name: string;
  brand: string;
  image: string | null;
  thumbnail: string | null;
  quantity?: string;
  servingSize?: string;
  categories: string[];
  nutriscoreGrade: string; // 'a' | 'b' | 'c' | 'd' | 'e' | 'unknown'
  ecoscoreGrade: string;
  novaGroup?: number;
  ingredientsText: string;
  allergens: string[];
  isNutritionalDataAvailable: boolean;
  nutriments?: NutritionalValues | null;
  nutritionLocked?: boolean;
  userSubscriptionStatus?: string;
  isFallbackEn?: boolean;
  fallbackLanguage?: string;
  availableLanguages?: string[];
}

export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  isGuest?: boolean;
  guestLimit?: number;
}

export type SearchResponse = SearchResult;

export interface RecentSearch {
  id: string;
  query: string;
  language: string;
  resultCount: number;
  createdAt: string;
}

export type SearchHistoryItem = RecentSearch;

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  name: string;
  subscriptionStatus: 'INACTIVE' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED';
  currentPeriodEnd?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  createdAt?: string;
}

export type User = UserProfile;

