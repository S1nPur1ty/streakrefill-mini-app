import { useEffect } from 'react';
import { FaXbox, FaPlaystation, FaSteam } from 'react-icons/fa';
import { SiNintendo } from 'react-icons/si';
import { IoGameController } from 'react-icons/io5';
import { X } from 'phosphor-react';
import { useAppStore } from '../stores';

export const ProductModal = () => {
  const { selectedProduct, closeProductModal } = useAppStore();

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

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeProductModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeProductModal]);

  // Close modal on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeProductModal();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-950/80 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between py-2 px-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <IconComponent size={24} className="text-primary" />
            <div>
              <h2 className="text-xl font-bold text-white">{selectedProduct.name}</h2>
              {selectedProduct.country_name && (
                <p className="text-gray-400 text-sm">{selectedProduct.country_name}</p>
              )}
            </div>
          </div>
          <button
            onClick={closeProductModal}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          <h3 className="text-lg font-semibold text-white mb-4">Available Options</h3>
          <div className="grid gap-3">
            {selectedProduct.packages.map((pkg) => {
              const price = (pkg.price / 100).toFixed(2);
              return (
                <div
                  key={pkg.id}
                  className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors border border-gray-600 hover:border-primary/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-primary font-bold text-lg">{price} {selectedProduct.currency || 'USD'}</div>
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
        </div>
      </div>
    </div>
  );
}; 