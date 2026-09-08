import { Product, SearchResponse, User, SearchHistoryItem, SupportedLanguage } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const TOKEN_STORAGE_KEY = 'nutriscan_auth_token';

export class ApiClient {
  public static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  }

  public static setToken(token: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch {
      // ignore
    }
  }

  public static clearToken(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  private static getHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = { ...extraHeaders };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // --- Authentication ---

  public static async register(username: string, email: string, password?: string): Promise<{ token: string; user: User; isSubscribed: boolean }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  public static async login(identifier: string, password?: string): Promise<{ token: string; user: User; isSubscribed: boolean }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  public static async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
      });
    } catch {
      // ignore
    } finally {
      this.clearToken();
    }
  }

  public static async getCurrentUser(): Promise<{ user: User | null; isSubscribed: boolean; isGuest?: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        cache: 'no-store',
        headers: this.getHeaders(),
        credentials: 'include',
      });
      if (!res.ok) {
        return { user: null, isSubscribed: false, isGuest: true };
      }
      const data = await res.json();
      return {
        user: data.user,
        isSubscribed: data.isSubscribed ?? false,
        isGuest: !data.user,
      };
    } catch {
      return { user: null, isSubscribed: false, isGuest: true };
    }
  }

  // --- Product Search ---

  public static async searchProducts(
    query: string,
    lang: SupportedLanguage = 'en',
    page: number = 1,
    pageSize: number = 24
  ): Promise<SearchResponse> {
    const res = await fetch(
      `${API_BASE}/products/search?q=${encodeURIComponent(query)}&lang=${lang}&page=${page}&pageSize=${pageSize}`,
      {
        cache: 'no-store',
        headers: this.getHeaders(),
        credentials: 'include',
      }
    );
    if (!res.ok) {
      throw new Error(`Search failed with status ${res.status}`);
    }
    return res.json();
  }

  public static async getProductByBarcode(
    barcode: string,
    lang: SupportedLanguage = 'en'
  ): Promise<Product> {
    const res = await fetch(
      `${API_BASE}/products/${encodeURIComponent(barcode)}?lang=${lang}`,
      {
        cache: 'no-store',
        headers: this.getHeaders(),
        credentials: 'include',
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch product ${barcode}`);
    }
    return res.json();
  }

  public static async createCheckoutSession(): Promise<{ checkoutUrl: string }> {
    const res = await fetch(`${API_BASE}/stripe/create-checkout-session`, {
      method: 'POST',
      headers: this.getHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error('Failed to create checkout session');
    }
    return res.json();
  }

  public static async verifyCheckoutSession(sessionId: string): Promise<{ success: boolean; isSubscribed: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/stripe/verify-session`, {
        method: 'POST',
        headers: this.getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ sessionId }),
        credentials: 'include',
      });
      if (!res.ok) {
        return { success: false, isSubscribed: false };
      }
      return res.json();
    } catch {
      return { success: false, isSubscribed: false };
    }
  }

  public static async cancelSubscription(): Promise<{ success: boolean; isSubscribed: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/stripe/cancel-subscription`, {
      method: 'POST',
      headers: this.getHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Failed to cancel subscription');
    }
    return res.json();
  }

  public static async getRecentSearches(limit: number = 10): Promise<SearchHistoryItem[]> {
    try {
      const res = await fetch(`${API_BASE}/searches/recent?limit=${limit}`, {
        cache: 'no-store',
        headers: this.getHeaders(),
        credentials: 'include',
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.recentSearches || data.searches || [];
    } catch {
      return [];
    }
  }

  public static async clearSearchHistory(): Promise<boolean> {
    const res = await fetch(`${API_BASE}/searches`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include',
    });
    return res.ok;
  }

  public static async deleteRecentSearch(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/searches/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        credentials: 'include',
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}

// Individual named exports for compatibility
export const searchProducts = ApiClient.searchProducts;
export const getProductByBarcode = ApiClient.getProductByBarcode;
export const getCurrentUser = ApiClient.getCurrentUser;
export const createCheckoutSession = async () => (await ApiClient.createCheckoutSession()).checkoutUrl;
export const cancelSubscription = ApiClient.cancelSubscription;
export const getRecentSearches = ApiClient.getRecentSearches;
export const clearRecentSearches = ApiClient.clearSearchHistory;
export const deleteRecentSearch = ApiClient.deleteRecentSearch.bind(ApiClient);
