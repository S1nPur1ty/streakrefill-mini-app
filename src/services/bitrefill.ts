import { BitrefillResponse, ProductCategory } from '../types/bitrefill';

const BASE_URL = '/api/bitrefill/v2';
const API_KEY = import.meta.env.VITE_BITREFILL_API_KEY;

if (!API_KEY) {
  console.warn('VITE_BITREFILL_API_KEY not found in environment variables');
}

class BitrefillService {
  private async makeRequest(endpoint: string): Promise<BitrefillResponse> {
    if (!API_KEY) {
      throw new Error('Bitrefill API key not configured');
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Bitrefill API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async searchProducts(query: string, limit: number = 50): Promise<BitrefillResponse> {
    const endpoint = `/products/search?q=${encodeURIComponent(query)}&start=0&limit=${limit}&include_test_products=false`;
    return this.makeRequest(endpoint);
  }

  async getProductsByCategory(category: ProductCategory): Promise<BitrefillResponse> {
    return this.searchProducts(category);
  }

  async getAllGamingProducts(): Promise<Record<ProductCategory, BitrefillResponse>> {
    const categories: ProductCategory[] = ['xbox', 'playstation', 'nintendo', 'steam'];
    
    try {
      const results = await Promise.all(
        categories.map(category => this.getProductsByCategory(category))
      );

      return categories.reduce((acc, category, index) => {
        acc[category] = results[index];
        return acc;
      }, {} as Record<ProductCategory, BitrefillResponse>);
    } catch (error) {
      console.error('Error fetching gaming products:', error);
      throw error;
    }
  }
}

export const bitrefillService = new BitrefillService(); 