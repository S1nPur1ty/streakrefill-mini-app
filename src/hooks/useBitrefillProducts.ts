import { useEffect } from 'react';
import { bitrefillService } from '../services/bitrefill';
import { useAppStore } from '../stores';

export const useBitrefillProducts = () => {
  const {
    products,
    productsLoading,
    productsError,
    setAllProducts,
    setProductsLoading,
    setProductsError
  } = useAppStore();

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError(null);
      
      const results = await bitrefillService.getAllGamingProducts();
      
      // Convert response format to products array
      const productsData = Object.entries(results).reduce((acc, [category, response]) => {
        acc[category as keyof typeof acc] = response.data;
        return acc;
      }, {} as Record<string, any>);
      
      setAllProducts(productsData);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProductsError(error instanceof Error ? error.message : 'Failed to fetch products');
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we don't have products yet
    const hasProducts = Object.values(products).some(categoryProducts => categoryProducts.length > 0);
    if (!hasProducts && !productsLoading) {
      fetchProducts();
    }
  }, []); // Empty dependency array - only run once on mount

  return {
    products,
    productsLoading,
    productsError,
    refetchProducts: fetchProducts
  };
}; 