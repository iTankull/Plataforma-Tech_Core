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

const getCategoryStyle = (category: string) => {
  const cat = category.toLowerCase().trim();
  if (cat === 'keyboard' || cat === 'teclado') {
    return 'bg-amber-50 text-amber-800 border-amber-200/60';
  }
  if (cat === 'câmeras' || cat === 'camera' || cat === 'cameras') {
    return 'bg-emerald-50 text-emerald-800 border-emerald-200/60';
  }
  if (cat === 'smartwatches' || cat === 'smartwatch') {
    return 'bg-indigo-50 text-indigo-800 border-indigo-200/60';
  }
  if (cat === 'microfones' || cat === 'microfone' || cat === 'mic') {
    return 'bg-rose-50 text-rose-800 border-rose-200/60';
  }
  if (cat === 'headset & headphones' || cat === 'headset' || cat === 'headphones') {
    return 'bg-sky-50 text-sky-800 border-sky-200/60';
  }
  if (cat === 'monitores portáteis' || cat === 'monitor' || cat === 'monitores') {
    return 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200/60';
  }
  if (cat === 'earbuds') {
    return 'bg-cyan-50 text-cyan-800 border-cyan-200/60';
  }
  if (cat === 'mouse') {
    return 'bg-violet-50 text-violet-800 border-violet-200/60';
  }
  if (cat === 'consoles portáteis' || cat === 'console' || cat === 'consoles') {
    return 'bg-orange-50 text-orange-800 border-orange-200/60';
  }
  if (cat === 'utilitários para café' || cat === 'café' || cat === 'cafe') {
    return 'bg-stone-100 text-stone-800 border-stone-200/60';
  }
  if (cat === 'board games' || cat === 'boardgame' || cat === 'jogo de tabuleiro') {
    return 'bg-lime-50 text-lime-800 border-lime-200/60';
  }
  return 'bg-slate-50 text-slate-800 border-slate-200/60';
};

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
      {/* Category Badge */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 border rounded-full ${getCategoryStyle(product.category)}`}>
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
          className={`w-full h-full object-cover transition-all duration-500 ${
            product.stock === 0 ? 'grayscale opacity-75' : 'group-hover:scale-105'
          }`}
          referrerPolicy="no-referrer"
        />
        {product.stock === 0 ? (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
            <span className="px-5 py-2.5 bg-black border-2 border-white text-white text-xs font-black tracking-widest uppercase">
              ESGOTADO
            </span>
          </div>
        ) : (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="px-5 py-2.5 bg-[#FF3E00] text-white text-xs font-black tracking-widest uppercase flex items-center gap-1.5">
              VER DETALHES
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        )}
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
        className={`p-4 flex justify-between items-center transition-all cursor-pointer font-black tracking-widest text-xs border-t border-border-subtle ${
          product.stock === 0 
            ? 'bg-bg-nested text-text-dim/80 hover:text-text-main hover:bg-bg-card' 
            : 'bg-text-main text-bg-main group-hover:bg-[#FF3E00] group-hover:text-white'
        }`}
      >
        <span>{product.stock === 0 ? 'VER DETALHES (ESGOTADO)' : 'DETALHES / ADQUIRIR'}</span>
        <span className="text-sm font-bold">{"->"}</span>
      </div>
    </motion.div>
  );
}
