import { FaXbox, FaPlaystation, FaSteam } from 'react-icons/fa';
import { SiNintendo } from 'react-icons/si';
import { IoGameController } from 'react-icons/io5';
import { BitrefillProduct } from '../types/bitrefill';

interface ProductCardProps {
  product: BitrefillProduct;
  onClick: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const lowestPrice = Math.min(...product.packages.map(pkg => pkg.price));
  const formattedPrice = (lowestPrice / 100).toFixed(2); // Convert cents to dollars

  // Determine the appropriate icon based on product name or category
  const getProductIcon = () => {
    const name = product.name.toLowerCase();
    if (name.includes('xbox')) return FaXbox;
    if (name.includes('playstation') || name.includes('psn') || name.includes('ps4') || name.includes('ps5')) return FaPlaystation;
    if (name.includes('nintendo') || name.includes('switch')) return SiNintendo;
    if (name.includes('steam')) return FaSteam;
    return IoGameController; // Default gaming icon
  };

  const IconComponent = getProductIcon();

  return (
    <div 
      onClick={onClick}
      className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <IconComponent size={20} className="text-primary" />
            <h3 className="text-white font-semibold text-lg">{product.name}</h3>
          </div>
          {product.country_name && (
            <p className="text-gray-400 text-sm">{product.country_name}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-primary font-bold">
          From {formattedPrice} {product.currency}
        </div>
        <div className="flex items-center gap-2">
          {product.in_stock !== false && (
            <span className="text-xs bg-secondary text-black px-2 py-1 rounded-full font-medium">
              In Stock
            </span>
          )}
          <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded-full">
            {product.packages.length} option{product.packages.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}; 