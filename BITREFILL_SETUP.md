# 🎮 Bitrefill API Integration Setup Guide

## 📋 Overview

This project integrates with the Bitrefill API to fetch gaming gift cards (Xbox, PlayStation, Nintendo, Steam) for purchase with cryptocurrency.

## 🔧 Setup Instructions

### 1. Get Bitrefill API Key
1. Visit [Bitrefill Developer Portal](https://www.bitrefill.com/developers)
2. Sign up for an API account
3. Generate your API key from the dashboard

### 2. Environment Configuration
1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Bitrefill API key to `.env.local`:
   ```env
   VITE_BITREFILL_API_KEY=your_actual_api_key_here
   ```

### 3. Restart Development Server
```bash
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

## 🏗️ Architecture

### File Structure
```
src/
├── types/bitrefill.ts          # TypeScript interfaces
├── services/bitrefill.ts       # API service class
├── hooks/useBitrefillProducts.ts # React hook for products
├── stores/useAppStore.ts       # Zustand state management
└── pages/Home.tsx              # Main products display
```

### Data Flow
1. **Home Component** → Uses `useBitrefillProducts` hook
2. **Hook** → Calls `bitrefillService.getAllGamingProducts()`
3. **Service** → Makes API requests to Bitrefill
4. **Store** → Manages products state with Zustand
5. **UI** → Displays products with filtering and sorting

## 🎯 Features

### Product Fetching
- **Xbox** products via search query
- **PlayStation** products via search query  
- **Nintendo** products via search query
- **Steam** products via search query
- **Parallel requests** for optimal performance

### UI Components
- **Category Tabs**: Filter by gaming platform
- **Sort Options**: Price, name, recommended
- **Product Cards**: Display with images, prices, stock status
- **Loading States**: Spinner during API calls
- **Error Handling**: Retry mechanism for failed requests

### State Management
- **Zustand Store**: Centralized products state
- **Loading States**: Track API request status
- **Error States**: Handle and display API errors
- **Caching**: Prevent unnecessary re-fetches

## 🔍 API Endpoints Used

### Search Products
```typescript
GET /v2/products/search?q=${query}&start=0&limit=50&include_test_products=false
```

### Response Format
```typescript
{
  "meta": {
    "start": 0,
    "limit": 50,
    "_endpoint": "/products/search",
    "_next": "..."
  },
  "data": [
    {
      "id": "xbox-live-gold",
      "name": "Xbox Live Gold",
      "packages": [
        {
          "id": "xbox-live-gold<&>25",
          "value": "25",
          "price": 2500  // Price in cents
        }
      ]
    }
  ]
}
```

## 🛠️ Code Examples

### Basic Product Fetch
```typescript
import { bitrefillService } from '../services/bitrefill';

// Fetch all gaming products
const results = await bitrefillService.getAllGamingProducts();

// Fetch specific category
const xboxProducts = await bitrefillService.getProductsByCategory('xbox');
```

### Using in Components
```typescript
import { useBitrefillProducts } from '../hooks/useBitrefillProducts';

const MyComponent = () => {
  const { products, productsLoading, productsError } = useBitrefillProducts();
  
  if (productsLoading) return <div>Loading...</div>;
  if (productsError) return <div>Error: {productsError}</div>;
  
  return (
    <div>
      {products.xbox.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};
```

## ⚠️ Important Notes

### Rate Limiting
- Bitrefill API has rate limits
- Products are cached after first fetch
- Use `refetchProducts()` sparingly

### Error Handling
- API key validation happens on first request
- Network errors are caught and displayed
- Users can retry failed requests

### Data Structure
- Prices are in **cents** (divide by 100 for display)
- Products include multiple packages with different values
- Some products may not have images or stock status

## 🚀 Next Steps

After basic setup, you can extend the integration with:

1. **Product Details Page**: Show individual product information
2. **Purchase Flow**: Implement Bitrefill purchase API
3. **Favorites**: Let users save preferred products
4. **Search**: Add text search functionality
5. **Pagination**: Handle large product lists

## 🔧 Troubleshooting

### Common Issues

**"API key not configured" Error**
- Check `.env.local` file exists
- Verify `VITE_BITREFILL_API_KEY` is set
- Restart development server

**"Failed to fetch products" Error**
- Check internet connection
- Verify API key is valid
- Check Bitrefill API status

**No Products Showing**
- Open browser developer tools
- Check console for API errors
- Verify API responses in Network tab

### Debug Commands
```bash
# Check environment variables
echo $VITE_BITREFILL_API_KEY

# Test API manually
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://api.bitrefill.com/v2/products/search?q=xbox&limit=5"
```

---

**Last Updated**: Created during streak-refill development session
**Status**: Production ready with error handling and caching 