import React from 'react';
import { motion } from 'motion/react';
import { Star, Heart, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';
import { Tooltip } from './Tooltip';
import { findGlossaryTerm } from '../data/glossary';

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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-bg-card border-2 border-border-subtle hover:border-[#FF3E00] rounded-none overflow-hidden transition-all duration-300 flex flex-col h-full group relative text-text-main"
    >
      {/* Favorite Button with brutalist style */}
      <button
        id={`btn-fav-${product.id}`}
        onClick={onToggleFavorite}
        className={`absolute top-4 right-4 z-10 p-2.5 rounded-none border-2 transition-all duration-200 active:scale-95 ${
          isFavorite 
            ? 'bg-[#FF3E00] border-[#FF3E00] text-white' 
            : 'bg-bg-card border-border-subtle text-text-muted hover:text-text-main hover:border-border-main'
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
        className="h-56 overflow-hidden bg-bg-nested relative cursor-pointer group border-b border-border-subtle"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
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
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-0.5">{renderStars(product.rating)}</div>
            <span className="text-[10px] font-mono font-bold text-text-dim">
              [{product.rating.toFixed(1)}]
            </span>
          </div>

          <h3 
            onClick={onClickDetails}
            className="font-sans font-black text-text-main text-xl tracking-tighter hover:text-[#FF3E00] transition-colors duration-200 uppercase line-clamp-2 cursor-pointer mb-4"
          >
            {product.name}
          </h3>
        </div>

        <div>
          {/* Stock Info */}
          <div className="mb-4">
            <div className="text-[10px] font-mono text-text-muted uppercase flex items-center justify-between">
              <span>ESTOQUE DISPONÍVEL:</span>
              <span className="text-[#FF3E00] font-black bg-bg-nested border border-border-subtle px-2 py-0.5">{product.stock} UNIDADE(S)</span>
            </div>
          </div>

          {/* Pricing details */}
          <div className="border-t border-border-subtle pt-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black tracking-widest text-text-dim uppercase">DE:</span>
                <span className="text-xs font-mono text-text-dim line-through">
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <span className="bg-[#FF3E00] text-white font-black text-[8px] tracking-widest px-1.5 py-0.5 uppercase">
                45% OFF
              </span>
            </div>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-[9px] font-black tracking-widest text-[#FF3E00] uppercase">POR:</span>
              <span className="text-2xl font-black italic tracking-tighter text-text-main font-sans">
                R$ {(product.price * 0.55).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button at the bottom */}
      <div 
        onClick={onClickDetails}
        className="bg-text-main text-bg-main p-4 flex justify-between items-center group-hover:bg-[#FF3E00] group-hover:text-white transition-all cursor-pointer font-black tracking-widest text-xs border-t border-border-subtle"
      >
        <span>DETALHES / ADQUIRIR</span>
        <span className="text-sm font-bold">{"->"}</span>
      </div>
    </motion.div>
  );
}
