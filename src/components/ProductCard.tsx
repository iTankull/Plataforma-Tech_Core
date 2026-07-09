import React from 'react';
import { motion } from 'motion/react';
import { Star, Heart, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onClickDetails: () => void;
}

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onClickDetails,
}: ProductCardProps): React.JSX.Element {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star key={i} className="w-3.5 h-3.5 fill-[#FF3E00] text-[#FF3E00]" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="w-3.5 h-3.5 text-white/20" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star className="w-3.5 h-3.5 fill-[#FF3E00] text-[#FF3E00]" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-white/20" />);
      }
    }
    return stars;
  };

  return (
    <motion.div
      id={`product-card-${product.id}`}
      layoutId={`card-container-${product.id}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-[#111111] border-2 border-white/10 hover:border-[#FF3E00] rounded-none overflow-hidden transition-all duration-300 flex flex-col h-full group relative text-white"
    >
      {/* Category badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-white text-black px-2.5 py-1 text-[10px] font-black tracking-widest uppercase">
          {product.category}
        </span>
      </div>

      {/* Favorite Button with brutalist style */}
      <button
        id={`btn-fav-${product.id}`}
        onClick={onToggleFavorite}
        className={`absolute top-4 right-4 z-10 p-2.5 rounded-none border-2 transition-all duration-200 active:scale-95 ${
          isFavorite 
            ? 'bg-[#FF3E00] border-[#FF3E00] text-white' 
            : 'bg-black border-white/10 text-white/60 hover:text-white hover:border-white'
        }`}
        aria-label="Adicionar aos favoritos"
      >
        <Heart
          className={`w-4 h-4 ${isFavorite ? 'fill-white text-white' : ''}`}
        />
      </button>

      {/* Media area */}
      <div 
        onClick={onClickDetails}
        className="h-56 overflow-hidden bg-black/40 relative cursor-pointer group border-b border-white/10"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="px-5 py-2.5 bg-[#FF3E00] text-white text-xs font-black tracking-widest uppercase flex items-center gap-1.5">
            VER DETALHES
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-0.5">{renderStars(product.rating)}</div>
          <span className="text-[10px] font-mono font-bold text-white/50">
            [{product.rating.toFixed(1)}]
          </span>
        </div>

        <h3 
          onClick={onClickDetails}
          className="font-sans font-black text-white text-xl tracking-tighter hover:text-[#FF3E00] transition-colors duration-200 uppercase line-clamp-1 cursor-pointer mb-2"
        >
          {product.name}
        </h3>

        <p className="text-white/60 text-xs leading-relaxed line-clamp-2 mb-5 flex-grow">
          {product.description}
        </p>

        {/* Specs List */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
            <span key={key} className="text-[9px] font-black tracking-widest uppercase bg-white/5 text-white/40 px-2.5 py-1 border border-white/5 truncate max-w-[140px]">
              {key}: {val}
            </span>
          ))}
        </div>

        {/* Observations and Stock */}
        <div className="mb-5 space-y-2">
          <div className="text-[10px] bg-white/5 border border-white/15 text-white/85 p-2.5 font-mono uppercase leading-normal">
            <strong className="text-[#FF3E00] font-black">[ESTADO]:</strong> {product.observations}
          </div>
          <div className="text-[10px] font-mono text-white/50 uppercase flex items-center gap-1.5">
            ESTOQUE DISPONÍVEL: <span className="text-[#FF3E00] font-black bg-white/5 border border-white/10 px-2 py-0.5">{product.stock} UNIDADE(S)</span>
          </div>
        </div>

        {/* Pricing details */}
        <div className="border-t border-white/10 pt-4 flex flex-col gap-1 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black tracking-widest text-white/40 uppercase">DE:</span>
            <span className="text-sm font-mono text-white/40 line-through">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="bg-[#FF3E00] text-white font-black text-[8px] tracking-widest px-1.5 py-0.5 uppercase">
              45% OFF
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black tracking-widest text-[#FF3E00] uppercase">POR:</span>
            <span className="text-3xl font-black italic tracking-tighter text-white mt-0.5">
              R$ {(product.price * 0.55).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button at the bottom */}
      <div 
        onClick={onClickDetails}
        className="bg-white text-black p-4 flex justify-between items-center group-hover:bg-[#FF3E00] group-hover:text-white transition-all cursor-pointer font-black tracking-widest text-xs border-t border-white/10"
      >
        <span>DETALHES / ADQUIRIR</span>
        <span className="text-sm font-bold">{"->"}</span>
      </div>
    </motion.div>
  );
}
