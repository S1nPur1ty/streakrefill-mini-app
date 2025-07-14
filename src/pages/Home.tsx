import { useState, useRef, useEffect } from 'react';
import { CircleNotch, Eye } from 'phosphor-react';
import { FaXbox, FaPlaystation, FaSteam } from 'react-icons/fa';
import { SiNintendo } from 'react-icons/si';
import { IoGameController } from 'react-icons/io5';
import { ProductModal, ProductCard } from '../components';
import { useBitrefillProducts } from '../hooks/useBitrefillProducts';
import { BitrefillProduct, ProductCategory } from '../types/bitrefill';
import { useAppStore } from '../stores';

const CategoryTabs = ({ 
  activeCategory, 
  onCategoryChange 
}: { 
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}) => {
  const categories = [
    { id: 'all', label: 'All', icon: IoGameController },
    { id: 'playstation', label: 'PS', icon: FaPlaystation },
    { id: 'xbox', label: 'Xbox', icon: FaXbox },
    { id: 'nintendo', label: 'Nintendo', icon: SiNintendo },
    { id: 'steam', label: 'Steam', icon: FaSteam }
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);

  const checkShadows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftShadow(scrollLeft > 0);
      setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkShadows();
    const handleResize = () => checkShadows();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative">
      {/* Left shadow */}
      {showLeftShadow && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none" />
      )}
      
      {/* Right shadow */}
      {showRightShadow && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none" />
      )}
      
      <div 
        ref={scrollRef}
        onScroll={checkShadows}
        className="flex gap-2 overflow-x-auto scrollbar-hide"
      >
              {categories.map((category) => {
        const IconComponent = category.icon;
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap border-0 outline-none ${
              activeCategory === category.id
                ? 'bg-primary text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-primary'
            }`}
          >
            <IconComponent size={16} />
            <span className="text-sm font-medium">{category.label}</span>
          </button>
        );
      })}
      </div>
    </div>
  );
};





const SortButton = ({ 
  activeSort, 
  onSortChange 
}: { 
  activeSort: string;
  onSortChange: (sort: string) => void;
}) => {
  const sortOptions = [
    { id: 'recommended', label: 'Recommended' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'name', label: 'Name A-Z' }
  ];

  return (
    <div className="relative">
      <select
        value={activeSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="bg-gray-800 text-white border border-gray-700 rounded-full pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em'
        }}
      >
        {sortOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const Home = () => {
  const { products, productsLoading, productsError, refetchProducts } = useBitrefillProducts();
  const { openProductModal, selectedProduct } = useAppStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSort, setActiveSort] = useState('recommended');
  const [displayCount, setDisplayCount] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 10;

  // Filter products based on selected category
  const getFilteredProducts = (): BitrefillProduct[] => {
    if (activeCategory === 'all') {
      return Object.values(products).flat();
    }
    return products[activeCategory as ProductCategory] || [];
  };

  // Sort products based on selected sort option
  const getSortedProducts = (productList: BitrefillProduct[]): BitrefillProduct[] => {
    const sorted = [...productList];
    
    switch (activeSort) {
      case 'price-low':
        return sorted.sort((a, b) => {
          const aPrice = Math.min(...a.packages.map(pkg => pkg.price));
          const bPrice = Math.min(...b.packages.map(pkg => pkg.price));
          return aPrice - bPrice;
        });
      case 'price-high':
        return sorted.sort((a, b) => {
          const aPrice = Math.min(...a.packages.map(pkg => pkg.price));
          const bPrice = Math.min(...b.packages.map(pkg => pkg.price));
          return bPrice - aPrice;
        });
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'recommended':
      default:
        return sorted;
    }
  };

  const filteredProducts = getFilteredProducts();
  const sortedProducts = getSortedProducts(filteredProducts);
  const displayedProducts = sortedProducts.slice(0, displayCount);
  const hasMoreProducts = displayCount < sortedProducts.length;

  const loadMoreProducts = async () => {
    if (isLoadingMore || !hasMoreProducts) return;
    
    setIsLoadingMore(true);
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    setDisplayCount(prev => Math.min(prev + ITEMS_PER_PAGE, sortedProducts.length));
    setIsLoadingMore(false);
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreProducts && !isLoadingMore) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMoreProducts, isLoadingMore]);

  // Reset pagination when category or sort changes
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
    setIsLoadingMore(false);
  }, [activeCategory, activeSort]);

  if (productsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading gift cards...</p>
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {productsError}</p>
          <button
            onClick={refetchProducts}
            className="bg-primary hover:bg-secondary text-black px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="max-w-4xl mx-auto">
        <div className="px-4 pb-4 mb-2">
          <h1 className="text-2xl font-bold text-white mb-2">Gift Cards</h1>
          <p className="text-gray-400">Purchase gaming gift cards with cryptocurrency</p>
        </div>

        {/* Sticky Tabs and Sort Container */}
        <div className="sticky top-[70px] z-40 bg-gray-950/80 border-b border-primary">
          <div className="border-b border-gray-800 py-2">
            <div className="px-4">
              <CategoryTabs 
                activeCategory={activeCategory} 
                onCategoryChange={setActiveCategory} 
              />
            </div>
          </div>

          <div className="px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              <Eye size={18} />
              <span>
                {displayedProducts.length}/{sortedProducts.length}
              </span>
            </div>
            <SortButton activeSort={activeSort} onSortChange={setActiveSort} />
          </div>
        </div>

        <div className="p-4">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No products found for this category</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={() => openProductModal(product)}
                  />
                ))}
              </div>
              
              {/* Infinite Scroll Loading/End Indicator */}
              <div ref={loadMoreRef} className="flex justify-center mt-8 py-4">
                {hasMoreProducts ? (
                  isLoadingMore ? (
                    <div className="flex items-center gap-2 text-primary">
                      <CircleNotch size={24} className="animate-spin" />
                      <span>Loading more products...</span>
                    </div>
                  ) : (
                    <div className="h-4" />
                  )
                ) : (
                  <div className="text-gray-400 text-center">
                    <p>🎮 End of products reached</p>
                    <p className="text-sm mt-1">You've seen all {sortedProducts.length} available items</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && <ProductModal />}
    </div>
  );
}; 