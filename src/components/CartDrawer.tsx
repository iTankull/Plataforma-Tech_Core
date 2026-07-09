import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onGoToCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onGoToCheckout,
}: CartDrawerProps): React.JSX.Element {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalWithDiscount = subtotal * 0.55;
  const discountAmount = subtotal * 0.45;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Drawer Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[450px] bg-black border-l-2 border-white z-50 flex flex-col h-full text-white"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#FF3E00]" />
                <h3 className="font-sans font-black text-lg tracking-tight uppercase">SEU CARRINHO</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:text-[#FF3E00] transition-colors"
                title="Fechar Carrinho"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center justify-center h-full">
                  <ShoppingBag className="w-12 h-12 text-white/10 mb-4" />
                  <h4 className="font-sans font-black tracking-widest text-xs uppercase mb-2">CARRINHO VAZIO</h4>
                  <p className="text-white/40 font-mono text-[10px] leading-relaxed max-w-[240px]">
                    Navegue pelos produtos e adicione revendas com 45% OFF para finalizar sua aquisição.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 border-b border-white/5 pb-4 last:border-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover border border-white/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[8px] font-black bg-white/10 text-white/50 px-1.5 py-0.5 rounded-none uppercase">
                            {item.product.category}
                          </span>
                          <h4 className="text-xs font-black text-white truncate uppercase mt-1 leading-tight">{item.product.name}</h4>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-white/40 hover:text-[#FF3E00] transition-colors"
                          title="Remover Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Pricing with flat discount */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-white/40 line-through font-mono">
                          R$ {item.product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs font-bold text-white font-mono">
                          R$ {(item.product.price * 0.55).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center mt-2.5">
                        <div className="flex items-center border border-white/15 bg-[#111]">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-0.5 hover:bg-white/5 text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="px-3 font-mono text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-0.5 hover:bg-white/5 text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Calculations & Action Buttons */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black space-y-4 font-mono">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-white/40">
                    <span>SOMA ORIGINAL DE TABELA:</span>
                    <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-[#FF3E00]">
                    <span>DESCONTO PADRÃO (45% OFF):</span>
                    <span>- R$ {discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="border-t border-white/5 pt-2 flex justify-between text-sm font-bold text-white">
                    <span className="uppercase tracking-widest text-[#FF3E00] font-black text-[10px]">VALOR FINAL:</span>
                    <span>R$ {totalWithDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onGoToCheckout();
                    }}
                    className="w-full py-4 bg-[#FF3E00] hover:bg-[#ff551f] text-white font-black tracking-widest text-xs uppercase flex items-center justify-center gap-2 transition-all"
                  >
                    <span>IR PARA O CHECKOUT</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={onClearCart}
                    className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-black tracking-widest text-[9px] uppercase border border-white/10 transition-all"
                  >
                    LIMPAR CARRINHO
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
