import { FaXbox, FaPlaystation, FaSteam } from 'react-icons/fa';
import { SiNintendo } from 'react-icons/si';
import { IoGameController } from 'react-icons/io5';
import { Tag } from 'phosphor-react';
import { useAppStore } from '../stores/useAppStore';
import { Modal } from './Modal';

export const ProductModal = () => {
  const { selectedProduct, closeProductModal, selectedCoupon } = useAppStore();

  // Don't render if no product is selected
  if (!selectedProduct) return null;

  const getProductIcon = () => {
    const name = selectedProduct.name.toLowerCase();
    if (name.includes('xbox')) return FaXbox;
    if (name.includes('playstation') || name.includes('psn') || name.includes('ps4') || name.includes('ps5')) return FaPlaystation;
    if (name.includes('nintendo') || name.includes('switch')) return SiNintendo;
    if (name.includes('steam')) return FaSteam;
    return IoGameController;
  };

  const IconComponent = getProductIcon();

  // Calculate discounted price based on coupon
  const calculatePrice = (originalPrice: number) => {
    if (!selectedCoupon) return originalPrice;
    
    if (selectedCoupon.type === 'discount') {
      return originalPrice * (1 - selectedCoupon.value / 100);
    } else if (selectedCoupon.type === 'freebie') {
      return Math.max(0, originalPrice - selectedCoupon.value * 100);
    }
    
    return originalPrice;
  };

  // Title component with product info
  const titleComponent = (
    <div>
      <h2 className="text-xl font-bold text-white">{selectedProduct.name}</h2>
      {selectedProduct.country_name && (
        <p className="text-gray-400 text-sm">{selectedProduct.country_name}</p>
      )}
    </div>
  );

  // Optional coupon display for header extra
  const couponDisplay = selectedCoupon && (
    <div className={`px-4 py-2 rounded-lg ${
      selectedCoupon.type === 'discount' 
        ? 'bg-primary/10' 
        : 'bg-secondary/10'
    }`}>
      <div className="flex items-center gap-2">
        <Tag size={16} className={selectedCoupon.type === 'discount' ? 'text-primary' : 'text-secondary'} />
        <div className="text-xs font-semibold text-white">
          {selectedCoupon.type === 'discount' 
            ? `${selectedCoupon.value}% OFF` 
            : `$${selectedCoupon.value} FREE`}
        </div>
      </div>
    </div>
  );

  const content = (
    <>
      <h3 className="text-lg font-semibold text-white mb-4">Available Options</h3>
      <div className="grid gap-3">
        {selectedProduct.packages.map((pkg) => {
          const originalPrice = pkg.price / 100;
          const discountedPrice = calculatePrice(pkg.price) / 100;
          const hasDiscount = selectedCoupon && discountedPrice < originalPrice;
          
          return (
            <div
              key={pkg.id}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors border border-gray-600 hover:border-primary/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {hasDiscount ? (
                      <>
                        <div className="text-primary font-bold text-lg">
                          {discountedPrice.toFixed(2)} {selectedProduct.currency || 'USD'}
                        </div>
                        <div className="text-gray-400 text-sm line-through">
                          {originalPrice.toFixed(2)} {selectedProduct.currency || 'USD'}
                        </div>
                      </>
                    ) : (
                      <div className="text-primary font-bold text-lg">
                        {originalPrice.toFixed(2)} {selectedProduct.currency || 'USD'}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">
                    Value: {pkg.value} {selectedProduct.currency || 'USD'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Stock: {pkg.amount}</p>
                  <button className="bg-primary hover:bg-secondary text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors mt-2">
                    Select
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <Modal
      isOpen={true}
      onClose={closeProductModal}
      title={titleComponent}
      icon={<IconComponent size={24} className="text-primary" />}
      headerExtra={couponDisplay}
      maxWidth="max-w-2xl"
    >
      {content}
    </Modal>
  );
}; 